// src/components/shared/StepNavigation.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface StepNavigationProps {
  steps: {
    id: number;
    name: string;
    description?: string;
  }[];
  currentStep: number;
  type: 'project' | 'planner';
}

export const allSteps = {
  project: [
    { id: 1, name: 'Package Selection', description: 'Choose your development package' },
    { id: 2, name: 'Add-ons', description: 'Customize with additional features' },
  ],
  planner: [
    { id: 3, name: 'Project Overview', description: 'Basic project information' },
    { id: 4, name: 'Business Goals', description: 'Define your objectives' },
    { id: 5, name: 'Design Preferences', description: 'Customize your look' },
  ],
};

const StepNavigation: React.FC<StepNavigationProps> = ({ steps, currentStep }) => {
  const getStepStatus = (stepId: number) => {
    if (currentStep > stepId) return 'completed';
    if (currentStep === stepId) return 'current';
    return 'upcoming';
  };

  return (
    <div className="relative mb-8">
      <div className="absolute top-4 left-0 right-0 h-px bg-border" aria-hidden="true" />
      <nav aria-label="Progress">
        <ol className="flex justify-between">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            return (
              <li key={step.id} className="relative flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${
                      status === 'completed'
                        ? 'bg-green-500 text-white'
                        : status === 'current'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                >
                  {status === 'completed' ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className="mt-2 text-sm">{step.name}</span>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default StepNavigation;
