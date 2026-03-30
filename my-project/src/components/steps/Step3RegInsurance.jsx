import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { regInsuranceSchema } from '../../services/validation';
import FormField from '../FormField';

const PLATE_TYPES = ['PRIVATE', 'COMMERCIAL', 'GOVERNMENT', 'DIPLOMATIC', 'PERSONALIZED'];
const REG_STATUSES = ['ACTIVE', 'SUSPENDED', 'EXPIRED', 'PENDING'];
const INS_STATUSES = ['ACTIVE', 'SUSPENDED', 'EXPIRED'];

export default function Step3RegInsurance({ defaultValues, onNext, onBack, isSubmitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(regInsuranceSchema),
    defaultValues,
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="step-form">
      <h2>Step 3: Registration & Insurance</h2>
      <div className="form-grid">
        <FormField label="Plate Number (e.g. RAB 123 A)" error={errors.plateNumber?.message}>
          <input {...register('plateNumber')} className={errors.plateNumber ? 'input-error' : ''} placeholder="RAB 123 A" />
        </FormField>
        <FormField label="Plate Type" error={errors.plateType?.message}>
          <select {...register('plateType')} className={errors.plateType ? 'input-error' : ''}>
            <option value="">Select plate type</option>
            {PLATE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Registration Date" error={errors.registrationDate?.message}>
          <input type="datetime-local" {...register('registrationDate')} className={errors.registrationDate ? 'input-error' : ''} />
        </FormField>
        <FormField label="Registration Expiry Date" error={errors.expiryDate?.message}>
          <input type="datetime-local" {...register('expiryDate')} className={errors.expiryDate ? 'input-error' : ''} />
        </FormField>
        <FormField label="Registration Status" error={errors.registrationStatus?.message}>
          <select {...register('registrationStatus')} className={errors.registrationStatus ? 'input-error' : ''}>
            <option value="">Select status</option>
            {REG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="State / Region" error={errors.state?.message}>
          <input {...register('state')} className={errors.state ? 'input-error' : ''} placeholder="e.g. Kigali" />
        </FormField>
        <FormField label="Roadworthy Certificate" error={errors.roadworthyCert?.message}>
          <input {...register('roadworthyCert')} className={errors.roadworthyCert ? 'input-error' : ''} placeholder="RWC-2024-00123" />
        </FormField>
        <FormField label="Customs Reference" error={errors.customsRef?.message}>
          <input {...register('customsRef')} className={errors.customsRef ? 'input-error' : ''} placeholder="CUS-RW-2024-00123" />
        </FormField>
        <FormField label="Proof of Ownership" error={errors.proofOfOwnership?.message}>
          <input {...register('proofOfOwnership')} className={errors.proofOfOwnership ? 'input-error' : ''} placeholder="LOG-BOOK-2024-XYZ" />
        </FormField>
        <FormField label="Policy Number" error={errors.policyNumber?.message}>
          <input {...register('policyNumber')} className={errors.policyNumber ? 'input-error' : ''} placeholder="POL-2024-00123" />
        </FormField>
        <FormField label="Insurance Company Name" error={errors.companyName?.message}>
          <input {...register('companyName')} className={errors.companyName ? 'input-error' : ''} placeholder="e.g. SANLAM Insurance Rwanda" />
        </FormField>
        <FormField label="Insurance Type" error={errors.insuranceType?.message}>
          <input {...register('insuranceType')} className={errors.insuranceType ? 'input-error' : ''} placeholder="e.g. Comprehensive" />
        </FormField>
        <FormField label="Insurance Expiry Date" error={errors.insuranceExpiryDate?.message}>
          <input type="datetime-local" {...register('insuranceExpiryDate')} className={errors.insuranceExpiryDate ? 'input-error' : ''} />
        </FormField>
        <FormField label="Insurance Status" error={errors.insuranceStatus?.message}>
          <select {...register('insuranceStatus')} className={errors.insuranceStatus ? 'input-error' : ''}>
            <option value="">Select status</option>
            {INS_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
      </div>
      <div className="step-actions">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
