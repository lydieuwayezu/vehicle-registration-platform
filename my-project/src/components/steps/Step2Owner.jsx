import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ownerSchema } from '../../services/validation';
import FormField from '../FormField';

const OWNER_TYPES = ['INDIVIDUAL', 'COMPANY', 'NGO', 'GOVERNMENT'];

export default function Step2Owner({ defaultValues, onNext, onBack }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(ownerSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const ownerType = watch('ownerType');

  return (
    <form onSubmit={handleSubmit(onNext)} className="step-form">
      <h2>Step 2: Owner Information</h2>
      <div className="form-grid">
        <FormField label="Owner Name" error={errors.ownerName?.message}>
          <input {...register('ownerName')} className={errors.ownerName ? 'input-error' : ''} placeholder="e.g. John Doe" />
        </FormField>
        <FormField label="Owner Type" error={errors.ownerType?.message}>
          <select {...register('ownerType')} className={errors.ownerType ? 'input-error' : ''}>
            <option value="">Select owner type</option>
            {OWNER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="National ID (16 digits)" error={errors.nationalId?.message}>
          <input {...register('nationalId')} className={errors.nationalId ? 'input-error' : ''} placeholder="1199000000000000" maxLength={16} />
        </FormField>
        <FormField label="Mobile Number (10 digits)" error={errors.mobile?.message}>
          <input {...register('mobile')} className={errors.mobile ? 'input-error' : ''} placeholder="0781234567" maxLength={10} />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <input type="email" {...register('email')} className={errors.email ? 'input-error' : ''} placeholder="owner@example.com" />
        </FormField>
        <FormField label="Address" error={errors.address?.message}>
          <input {...register('address')} className={errors.address ? 'input-error' : ''} placeholder="KG 123 St, Kigali" />
        </FormField>
        {ownerType === 'COMPANY' && (
          <FormField label="Company Registration Number" error={errors.companyRegNumber?.message}>
            <input {...register('companyRegNumber')} className={errors.companyRegNumber ? 'input-error' : ''} placeholder="RWA/2023/00123" />
          </FormField>
        )}
        <FormField label="Passport Number (optional)" error={errors.passportNumber?.message}>
          <input {...register('passportNumber')} className={errors.passportNumber ? 'input-error' : ''} placeholder="PC1234567" />
        </FormField>
      </div>
      <div className="step-actions">
        <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
        <button type="submit" className="btn-primary">Next →</button>
      </div>
    </form>
  );
}
