import React from 'react';

interface StepNavigationProps {
  steps: { id: number; name: string }[];
  currentStep: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-xs">
        {steps.map(step => (
          <div
            key={step.id}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= step.id ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400'
            }`}
          >
            {step.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepNavigation;
