/**
 * FILE: src/services/api.js
 *
 * KEY FUNCTIONALITY:
 * This is the centralized API utility for the entire application.
 * It creates a single Axios instance configured with the backend base URL
 * and exports one function for every API endpoint the app needs.
 *
 * WHY THIS FILE EXISTS:
 * Instead of writing axios.get(...) scattered across every component,
 * all API calls live here. If the base URL ever changes, you only update
 * one line in this file and everything else keeps working.
 *
 * EXPORTS:
 * - getVehicles()              → GET  /vehicle           (fetch all vehicles)
 * - getVehicle(id)             → GET  /vehicle/:id       (fetch one vehicle)
 * - getVehicleInfo(id)         → GET  /vehicle/:id/info  (vehicle info tab)
 * - getVehicleOwner(id)        → GET  /vehicle/:id/owner (owner tab)
 * - getVehicleRegistration(id) → GET  /vehicle/:id/registration
 * - getVehicleInsurance(id)    → GET  /vehicle/:id/insurance
 * - createVehicle(data)        → POST /vehicle           (register new vehicle)
 * - updateVehicle(id, data)    → PUT  /vehicle/:id       (edit vehicle)
 * - deleteVehicle(id)          → DELETE /vehicle/:id     (delete vehicle)
 */

import axios from 'axios';

// The base URL of the backend API — all requests are sent to this address
const BASE = 'https://student-management-system-backend.up.railway.app/api/vehicle-service';

// Create a single reusable Axios instance with shared configuration.
// Every function below uses this same instance so headers and baseURL
// are automatically applied to every request.
const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }, // tell the server we are sending JSON
  timeout: 15000, // cancel the request if the server takes more than 15 seconds
});

// ─── READ OPERATIONS (GET) ────────────────────────────────────────────────────

// Fetch the full list of all registered vehicles (used on Home and Dashboard)
export const getVehicles = () => api.get('/vehicle').then(r => r.data);

// Fetch a single vehicle's complete record by its ID (used in EditVehicle)
export const getVehicle = (id) => api.get(`/vehicle/${id}`).then(r => r.data);

// Fetch only the vehicle info section (used in VehicleDetails → Info tab)
export const getVehicleInfo = (id) => api.get(`/vehicle/${id}/info`).then(r => r.data);

// Fetch only the owner section (used in VehicleDetails → Owner tab)
export const getVehicleOwner = (id) => api.get(`/vehicle/${id}/owner`).then(r => r.data);

// Fetch only the registration section (used in VehicleDetails → Registration tab)
export const getVehicleRegistration = (id) => api.get(`/vehicle/${id}/registration`).then(r => r.data);

// Fetch only the insurance section (used in VehicleDetails → Insurance tab)
export const getVehicleInsurance = (id) => api.get(`/vehicle/${id}/insurance`).then(r => r.data);

// ─── WRITE OPERATIONS (POST / PUT / DELETE) ───────────────────────────────────

// Send a new vehicle payload to the server to create a record (used in RegisterVehicle)
export const createVehicle = (data) => api.post('/vehicle', data).then(r => r.data);

// Send updated vehicle data to overwrite an existing record (used in EditVehicle)
export const updateVehicle = (id, data) => api.put(`/vehicle/${id}`, data).then(r => r.data);

// Delete a vehicle record permanently by its ID (used in Dashboard)
export const deleteVehicle = (id) => api.delete(`/vehicle/${id}`).then(r => r.data);

export default api;
