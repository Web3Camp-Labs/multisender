import React from 'react';
import { FileEarmarkCode, Check2Square, Display } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

interface StepNavProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { icon: <FileEarmarkCode size={24} />, label: 'Step1. Prepare' },
  { icon: <Check2Square size={24} />, label: 'Step2. Confirm' },
  { icon: <Display size={24} />, label: 'Step3. Result' },
];

const StepNav: React.FC<StepNavProps> = ({ currentStep, onStepChange }) => {
  return (
    <div className="my-4">
      <ul className="nav justify-content-center align-items-center">
        {steps.map((step, idx) => (
          <li
            key={idx}
            className={`nav-item mx-2 ${currentStep === idx + 1 ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onStepChange(idx + 1)}
          >
            <div
              className={`d-flex flex-column align-items-center p-3 rounded-circle border ${currentStep === idx + 1 ? 'bg-white shadow text-primary border-primary' : 'bg-light text-secondary border-light'}`}
              style={{ width: 64, height: 64 }}
            >
              {step.icon}
            </div>
            <div className={`mt-2 fw-bold ${currentStep === idx + 1 ? 'text-primary' : 'text-secondary'}`}
                 style={{ fontSize: 14 }}>
              {step.label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepNav;
