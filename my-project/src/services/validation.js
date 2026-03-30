/**
 * FILE: src/services/validation.js
 *
 * KEY FUNCTIONALITY:
 * Defines all Zod validation schemas used by the 3-step registration form.
 * These schemas mirror the backend's data rules exactly, so errors are caught
 * on the client before the request is even sent to the server.
 *
 * WHY ZOD:
 * Zod lets us describe the shape and rules of our data as JavaScript objects.
 * React Hook Form then uses these schemas (via @hookform/resolvers/zod) to
 * automatically validate each field and produce error messages.
 *
 * EXPORTS:
 * - vehicleInfoSchema   → validates Step 1 (vehicle details)
 * - ownerSchema         → validates Step 2 (owner details, with conditional rules)
 * - regInsuranceSchema  → validates Step 3 (registration & insurance details)
 */

import { z } from 'zod';

// Get the current year dynamically so the year validation stays accurate every year
const currentYear = new Date().getFullYear();

// ─── STEP 1: VEHICLE INFORMATION SCHEMA ──────────────────────────────────────
export const vehicleInfoSchema = z.object({

  // Must be a non-empty string — .trim() removes accidental leading/trailing spaces
  manufacture: z.string().min(1, 'Manufacturer is required').trim(),
  model: z.string().min(1, 'Model is required').trim(),

  // z.coerce.number() converts the string from the input into a number automatically
  // .int() ensures it is a whole number (no decimals)
  year: z.coerce.number().int()
    .min(1886, 'Year must be >= 1886')           // 1886 = year the first car was made
    .max(currentYear + 1, `Year must be <= ${currentYear + 1}`),

  // z.enum() only allows one of the listed values — anything else fails validation
  vehicleType: z.enum(
    ['ELECTRIC', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'PICKUP', 'OTHER'],
    { errorMap: () => ({ message: 'Select a vehicle type' }) }
  ),

  fuelType: z.enum(
    ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'OTHER'],
    { errorMap: () => ({ message: 'Select a fuel type' }) }
  ),

  // Engine capacity must be at least 1 (cannot be 0 or negative)
  engineCapacity: z.coerce.number().int().min(1, 'Engine capacity must be > 0'),

  bodyType: z.string().min(1, 'Body type is required').trim(),
  color: z.string().min(1, 'Color is required').trim(),

  // At least 1 seat required
  seatingCapacity: z.coerce.number().int().min(1, 'Seating capacity must be >= 1'),

  // Odometer can be 0 (brand new vehicle) but not negative
  odometerReading: z.coerce.number().int().min(0, 'Odometer must be >= 0'),

  vehiclePurpose: z.enum(
    ['PERSONAL', 'COMMERCIAL', 'TAXI', 'GOVERNMENT'],
    { errorMap: () => ({ message: 'Select a purpose' }) }
  ),

  vehicleStatus: z.enum(
    ['NEW', 'USED', 'REBUILT'],
    { errorMap: () => ({ message: 'Select a status' }) }
  ),
});

// ─── STEP 2: OWNER INFORMATION SCHEMA ────────────────────────────────────────
export const ownerSchema = z.object({

  ownerName: z.string().min(1, 'Owner name is required').trim(),

  ownerType: z.enum(
    ['INDIVIDUAL', 'COMPANY', 'NGO', 'GOVERNMENT'],
    { errorMap: () => ({ message: 'Select an owner type' }) }
  ),

  // .regex() tests the value against a regular expression pattern
  // ^\d{16}$ means: start, exactly 16 digit characters, end
  nationalId: z.string().regex(/^\d{16}$/, 'National ID must be exactly 16 digits'),

  // Exactly 10 digits for Rwandan mobile numbers
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),

  // .email() checks for a valid email format (e.g. user@example.com)
  email: z.string().email('Invalid email address'),

  address: z.string().min(1, 'Address is required').trim(),

  // .optional() means this field is not required — it can be left empty
  companyRegNumber: z.string().optional(),
  passportNumber: z.string().optional(),

}).superRefine((data, ctx) => {
  // superRefine allows cross-field validation (checking multiple fields together)

  // CONDITIONAL RULE: companyRegNumber is only required when ownerType is COMPANY
  if (data.ownerType === 'COMPANY' && !data.companyRegNumber?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Company registration number is required for COMPANY type',
      path: ['companyRegNumber'], // attach the error to the companyRegNumber field
    });
  }

  // PASSPORT RULE: if the user typed something in passport, it cannot be only spaces
  if (
    data.passportNumber !== undefined &&
    data.passportNumber !== '' &&
    data.passportNumber.trim() === ''
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passport number cannot be empty spaces',
      path: ['passportNumber'],
    });
  }
});

// ─── REUSABLE FUTURE DATE VALIDATOR ──────────────────────────────────────────
// This validator is used for both expiryDate and insuranceExpiryDate.
// It checks that the date string is valid AND that the date is in the future.
const futureDate = z.string()
  .min(1, 'Date is required')
  .refine(val => {
    const d = new Date(val);
    // isNaN check ensures the string is actually a valid date
    // d > new Date() ensures the date has not already passed
    return !isNaN(d.getTime()) && d > new Date();
  }, 'Date cannot be in the past');

// ─── STEP 3: REGISTRATION & INSURANCE SCHEMA ─────────────────────────────────
export const regInsuranceSchema = z.object({

  // Rwandan plate number format: RAB 123 A, GR 456, CD 789 B etc.
  // The regex allows optional spaces between parts and is case-insensitive
  plateNumber: z.string().regex(
    /^(R[A-Z]{2}|GR|CD)\s?\d{3}\s?[A-Z]?$/i,
    'Invalid Rwandan plate (e.g. RAB 123 A)'
  ),

  plateType: z.enum(
    ['PRIVATE', 'COMMERCIAL', 'GOVERNMENT', 'DIPLOMATIC', 'PERSONALIZED'],
    { errorMap: () => ({ message: 'Select a plate type' }) }
  ),

  // registrationDate just needs to be a non-empty string (can be past or present)
  registrationDate: z.string().min(1, 'Registration date is required'),

  // expiryDate must be in the future (uses the reusable validator above)
  expiryDate: futureDate,

  registrationStatus: z.enum(
    ['ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING'],
    { errorMap: () => ({ message: 'Select a status' }) }
  ),

  // State/region where the vehicle is registered (e.g. "Kigali")
  state: z.string().min(1, 'State/Region is required').trim(),

  // All document reference fields are required strings
  roadworthyCert: z.string().min(1, 'Roadworthy certificate is required'),
  customsRef: z.string().min(1, 'Customs reference is required'),
  proofOfOwnership: z.string().min(1, 'Proof of ownership is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  companyName: z.string().min(1, 'Insurance company name is required'),
  insuranceType: z.string().min(1, 'Insurance type is required'),

  // Insurance expiry must also be a future date
  insuranceExpiryDate: futureDate,

  // Insurance does NOT have PENDING as an option (unlike registration)
  insuranceStatus: z.enum(
    ['ACTIVE', 'SUSPENDED', 'EXPIRED'],
    { errorMap: () => ({ message: 'Select insurance status' }) }
  ),
});
