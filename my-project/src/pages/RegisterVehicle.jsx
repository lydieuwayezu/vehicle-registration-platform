import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVehicle } from '../services/api';
import Step1VehicleInfo from '../components/steps/Step1VehicleInfo';
import Step2Owner from '../components/steps/Step2Owner';
import Step3RegInsurance from '../components/steps/Step3RegInsurance';
import toast from 'react-hot-toast';

const STEPS = ['Vehicle Info', 'Owner', 'Registration & Insurance'];

export default function RegisterVehicle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const mutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Vehicle registered successfully!');
      navigate('/dashboard');
    },
    onError: (err) => {
      const errors = err?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach(e => toast.error(e.message ?? e));
      } else {
        toast.error(err?.response?.data?.message ?? 'Registration failed.');
      }
    },
  });

  const handleNext = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (stepData) => {
    const payload = { ...formData, ...stepData };
    mutation.mutate(payload);
  };

  return (
    <div className="page">
      <h1>Register New Vehicle</h1>
      <div className="stepper">
        {STEPS.map((label, i) => (
          <div key={label} className={`step-indicator ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <span>{i + 1}</span> {label}
          </div>
        ))}
      </div>

      {step === 0 && <Step1VehicleInfo defaultValues={formData} onNext={handleNext} />}
      {step === 1 && <Step2Owner defaultValues={formData} onNext={handleNext} onBack={handleBack} />}
      {step === 2 && <Step3RegInsurance defaultValues={formData} onNext={handleSubmit} onBack={handleBack} isSubmitting={mutation.isPending} />}
    </div>
  );
}
