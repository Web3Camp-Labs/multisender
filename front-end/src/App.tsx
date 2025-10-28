import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StepNav from './components/StepNav';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import { useWeb3 } from './context/Web3Context';

function App() {
  const [step, setStep] = useState<number>(1);
  console.log('[App] step:', step);
  const { state } = useWeb3();
  const { tips } = state;

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
  };

  const handleNext = (nextStep?: number) => {
    if (typeof nextStep === 'number') {
      setStep(nextStep);
    } else {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="container d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        {tips && (
          <div className="alert alert-info text-center my-3" role="alert">
            {tips}
            {tips.toLowerCase().includes('connect') && <Loading />}
          </div>
        )}
        <StepNav currentStep={step} onStepChange={handleStepChange} />
        <div className="card p-4 mb-4">
          {step === 1 && <Step1 handleNext={handleNext} />}
          {step === 2 && <Step2 handleNext={handleNext} handlePrev={handlePrev} />}
          {step === 3 && <Step3 handlePrev={handlePrev} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
