import React from 'react';
import { useCopilot } from '../context/CopilotContext';
import { Stepper } from '../components/layout/Stepper';
import { Step1View } from '../components/step1/Step1View';
import { Step2View } from '../components/step2/Step2View';
import { Step3View } from '../components/step3/Step3View';
import { Step4View } from '../components/step4/Step4View';

export const CopilotPage: React.FC = () => {
  const { step } = useCopilot();

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12">
      {/* 4-Step Progress Stepper */}
      <Stepper />

      {/* Active Step Workspace */}
      {step === 1 && <Step1View />}
      {step === 2 && <Step2View />}
      {step === 3 && <Step3View />}
      {step === 4 && <Step4View />}
    </div>
  );
};
