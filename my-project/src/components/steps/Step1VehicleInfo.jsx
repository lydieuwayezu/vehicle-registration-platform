import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleInfoSchema } from '../../services/validation';
import FormField from '../FormField';

const VEHICLE_TYPES = ['ELECTRIC', 'SUV', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN', 'PICKUP', 'OTHER'];
const FUEL_TYPES = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'GAS', 'OTHER'];
const PURPOSES = ['PERSONAL', 'COMMERCIAL', 'TAXI', 'GOVERNMENT'];
const STATUSES = ['NEW', 'USED', 'REBUILT'];

export default function Step1VehicleInfo({ defaultValues, onNext }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(vehicleInfoSchema),
    defaultValues,
    mode: 'onBlur',
  });
  

  return (
    <form onSubmit={handleSubmit(onNext)} className="step-form">
      <h2>Step 1: Vehicle Information</h2>
      <div className="form-grid">
        <FormField label="Manufacturer" error={errors.manufacture?.message}>
          <input {...register('manufacture')} className={errors.manufacture ? 'input-error' : ''} placeholder="e.g. Toyota" />
        </FormField>
        <FormField label="Model" error={errors.model?.message}>
          <input {...register('model')} className={errors.model ? 'input-error' : ''} placeholder="e.g. Camry" />
        </FormField>
        <FormField label="Year" error={errors.year?.message}>
          <input type="number" {...register('year')} className={errors.year ? 'input-error' : ''} placeholder="e.g. 2022" />
        </FormField>
        <FormField label="Vehicle Type" error={errors.vehicleType?.message}>
          <select {...register('vehicleType')} className={errors.vehicleType ? 'input-error' : ''}>
            <option value="">Select type</option>
            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Fuel Type" error={errors.fuelType?.message}>
          <select {...register('fuelType')} className={errors.fuelType ? 'input-error' : ''}>
            <option value="">Select fuel type</option>
            {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Engine Capacity (cc)" error={errors.engineCapacity?.message}>
          <input type="number" {...register('engineCapacity')} className={errors.engineCapacity ? 'input-error' : ''} placeholder="e.g. 1800" />
        </FormField>
        <FormField label="Body Type" error={errors.bodyType?.message}>
          <input {...register('bodyType')} className={errors.bodyType ? 'input-error' : ''} placeholder="e.g. Sedan" />
        </FormField>
        <FormField label="Color" error={errors.color?.message}>
          <input {...register('color')} className={errors.color ? 'input-error' : ''} placeholder="e.g. White" />
        </FormField>
        <FormField label="Seating Capacity" error={errors.seatingCapacity?.message}>
          <input type="number" {...register('seatingCapacity')} className={errors.seatingCapacity ? 'input-error' : ''} placeholder="e.g. 5" />
        </FormField>
        <FormField label="Odometer Reading (km)" error={errors.odometerReading?.message}>
          <input type="number" {...register('odometerReading')} className={errors.odometerReading ? 'input-error' : ''} placeholder="e.g. 45000" />
        </FormField>
        <FormField label="Purpose" error={errors.vehiclePurpose?.message}>
          <select {...register('vehiclePurpose')} className={errors.vehiclePurpose ? 'input-error' : ''}>
            <option value="">Select purpose</option>
            {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </FormField>
        <FormField label="Vehicle Status" error={errors.vehicleStatus?.message}>
          <select {...register('vehicleStatus')} className={errors.vehicleStatus ? 'input-error' : ''}>
            <option value="">Select status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
      </div>
      <div className="step-actions">
        <button type="submit" className="btn-primary">Next →</button>
      </div>
    </form>
  );
}
