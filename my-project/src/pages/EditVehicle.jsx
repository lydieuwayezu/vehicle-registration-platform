import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVehicle, updateVehicle } from '../services/api';
import Step1VehicleInfo from '../components/steps/Step1VehicleInfo';
import Step2Owner from '../components/steps/Step2Owner';
import Step3RegInsurance from '../components/steps/Step3RegInsurance';
import toast from 'react-hot-toast';

const STEPS = ['Vehicle Info', 'Owner', 'Registration & Insurance'];

// Convert ISO date string → datetime-local format (YYYY-MM-DDTHH:mm)
const toLocalDatetime = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

export default function EditVehicle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [serverError, setServerError] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicle(id),
  });

  // Pre-fill form with existing data, converting date fields for datetime-local inputs
  useEffect(() => {
    if (data) {
      const raw = Array.isArray(data) ? data[0] : data;
      setFormData({
        ...raw,
        registrationDate: toLocalDatetime(raw.registrationDate),
        expiryDate: toLocalDatetime(raw.expiryDate),
        insuranceExpiryDate: toLocalDatetime(raw.insuranceExpiryDate),
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload) => updateVehicle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicle', id] });
      toast.success('Vehicle updated!');
      navigate(`/vehicle/${id}`);
    },
    onError: (err) => {
      const data = err?.response?.data;
      const msg = Array.isArray(data?.errors)
        ? data.errors.join('\n')
        : (data?.error ?? data?.message ?? 'Update failed.');
      msg.split('\n').forEach(line => toast.error(line, { duration: 6000 }));
      setServerError(msg);
      setStep(2);
    },
  });

  if (isLoading || !formData) return <div className="center-msg">Loading vehicle data...</div>;

  if (isError) return (
    <div className="page">
      <div className="error-banner">Failed to load vehicle. <button onClick={() => navigate('/dashboard')} className="btn-secondary">← Back</button></div>
    </div>
  );

  const handleNext = (stepData) => {
    setServerError('');
    setFormData(prev => ({ ...prev, ...stepData }));
    setStep(s => s + 1);
  };

  return (
    <div className="page">
      <h1>Edit Vehicle</h1>
      <div className="stepper">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-indicator ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <span>{i + 1}</span> {label}
          </div>
        ))}
      </div>

      {serverError && (
        <div className="error-banner" style={{ marginBottom: '1rem' }}>
          <strong>Update failed:</strong>
          <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
            {serverError.split('\n').map((line, i) => <li key={i}>{line}</li>)}
          </ul>
          <small style={{ display: 'block', marginTop: '0.5rem' }}>
            ⚠️ Plate number, national ID, email, and mobile must be unique across all vehicles.
          </small>
        </div>
      )}
      {step === 0 && <Step1VehicleInfo defaultValues={formData} onNext={handleNext} />}
      {step === 1 && <Step2Owner defaultValues={formData} onNext={handleNext} onBack={() => setStep(s => s - 1)} />}
      {step === 2 && (
        <Step3RegInsurance
          defaultValues={formData}
          onNext={(stepData) => mutation.mutate({ ...formData, ...stepData })}
          onBack={() => setStep(s => s - 1)}
          isSubmitting={mutation.isPending}
        />
      )}
    </div>
  );
}
