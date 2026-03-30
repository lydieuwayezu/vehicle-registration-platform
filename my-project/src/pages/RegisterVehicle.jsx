import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVehicle } from '../services/api';
import Step1VehicleInfo from '../components/steps/Step1VehicleInfo';
import Step2Owner from '../components/steps/Step2Owner';
import Step3RegInsurance from '../components/steps/Step3RegInsurance';
import toast from 'react-hot-toast';

const STEPS = ['Vehicle Info', 'Owner', 'Registration & Insurance'];

// Helper — extract the most useful message from any API error response
const getErrorMessage = (err) => {
  const data = err?.response?.data;
  if (!data) return 'Network error — check your connection.';

  // Case 1: API returns { errors: [...] } array (validation errors)
  if (Array.isArray(data.errors)) return data.errors.join('\n');

  // Case 2: API returns { error: "..." } single string (e.g. duplicate key)
  if (data.error) return data.error;

  // Case 3: API returns { message: "..." }
  if (data.message) return data.message;

  return 'Registration failed. Please try again.';
};

export default function RegisterVehicle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [serverError, setServerError] = useState(''); // store server error to show in UI

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle registered successfully!');
      navigate('/dashboard');
    },
    onError: (err) => {
      const msg = getErrorMessage(err);

      // Show each line as a separate toast if multiple errors
      msg.split('\n').forEach(line => toast.error(line, { duration: 6000 }));

      // Also show a persistent banner on the form so the user can read it clearly
      setServerError(msg);

      // Go back to step 3 so the user can fix the fields
      setStep(2);
    },
  });

  const handleNext = (stepData) => {
    setServerError(''); // clear any previous server error when moving forward
    setFormData(prev => ({ ...prev, ...stepData }));
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setServerError('');
    setStep(s => s - 1);
  };

  const handleSubmit = (stepData) => {
    setServerError('');
    const payload = { ...formData, ...stepData };
    mutation.mutate(payload);
  };

  return (
    <div className="page">
      <h1>Register New Vehicle</h1>

      {/* Step progress indicator */}
      <div className="stepper">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-indicator ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <span>{i + 1}</span> {label}
          </div>
        ))}
      </div>

      {/* Server error banner — shown when the API rejects the submission */}
      {serverError && (
        <div className="error-banner" style={{ marginBottom: '1rem' }}>
          <strong>Submission failed:</strong>
          <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
            {serverError.split('\n').map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <small style={{ display: 'block', marginTop: '0.5rem' }}>
            ⚠️ The plate number, national ID, email, and mobile must be unique — not already used by another vehicle.
          </small>
        </div>
      )}

      {step === 0 && <Step1VehicleInfo defaultValues={formData} onNext={handleNext} />}
      {step === 1 && <Step2Owner defaultValues={formData} onNext={handleNext} onBack={handleBack} />}
      {step === 2 && (
        <Step3RegInsurance
          defaultValues={formData}
          onNext={handleSubmit}
          onBack={handleBack}
          isSubmitting={mutation.isPending}
        />
      )}
    </div>
  );
}
