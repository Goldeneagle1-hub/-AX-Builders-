import React from 'react';
import { useCopilot } from '../context/CopilotContext';
import { InfographicHero } from '../components/layout/InfographicHero';
import { Step1View } from '../components/step1/Step1View';
import { Step2View } from '../components/step2/Step2View';
import { Step3View } from '../components/step3/Step3View';
import { Step4View } from '../components/step4/Step4View';

export const CopilotPage: React.FC = () => {
  const { step } = useCopilot();

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12">
      {/* Interactive 4-Column Portal Hub + Jeju Map Selector */}
      <InfographicHero />

      {/* Active Step Workspace */}
      {step === 1 && <Step1View />}
      {step === 2 && <Step2View />}
      {step === 3 && <Step3View />}
      {step === 4 && <Step4View />}
    </div>
  );
};
