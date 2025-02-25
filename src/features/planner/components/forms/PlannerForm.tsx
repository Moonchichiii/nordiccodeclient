// src/features/planner/components/forms/PlannerForm.tsx
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import ProjectOverviewStep from '@/features/planner/components/steps/ProjectOverviewStep';
import BusinessGoalsStep from '@/features/planner/components/steps/BusinessGoalsStep';
import DesignPreferencesStep from '@/features/planner/components/steps/DesignPreferencesStep';
import StepNavigation from '@/features/planner/components/StepNavigation';
import { Requirements, initialRequirements } from '@/features/planner/types/types';

interface PlannerFormProps {
  onSubmit: (data: Requirements) => void;
}

const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit }) => {
  // Internal state (steps 1, 2, 3)
  const [step, setStep] = useState<number>(1);
  const [requirements, setRequirements] = useState<Requirements>(initialRequirements);

  // Local steps used internally (with IDs 1, 2, 3)
  const stepsArr = [
    { id: 1, name: 'Overview' },
    { id: 2, name: 'Business Goals' },
    { id: 3, name: 'Design Preferences' },
  ];

  // Create displayed steps with an offset so they show as 3, 4, 5.
  const displayedSteps = stepsArr.map(s => ({ ...s, id: s.id + 2 }));

  const renderStep = (): JSX.Element | null => {
    switch (step) {
      case 1:
        return (
          <ProjectOverviewStep
            data={requirements.projectOverview}
            updateData={(data) =>
              setRequirements((prev) => ({
                ...prev,
                projectOverview: { ...prev.projectOverview, ...data },
              }))
            }
          />
        );
      case 2:
        return (
          <BusinessGoalsStep
            data={requirements.businessGoals}
            updateData={(data) =>
              setRequirements((prev) => ({
                ...prev,
                businessGoals: { ...prev.businessGoals, ...data },
              }))
            }
          />
        );
      case 3:
        return (
          <DesignPreferencesStep
            designPreferences={requirements.designPreferences}
            onChange={(data) =>
              setRequirements((prev) => ({
                ...prev,
                designPreferences: { ...prev.designPreferences, ...data },
              }))
            }
          />
        );
      default:
        return null;
    }
  };

  const handleNext = (): void => {
    if (step < stepsArr.length) {
      setStep(step + 1);
    } else {
      onSubmit(requirements);
    }
  };

  const handleBack = (): void => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="relative pb-24">
      <div className="space-y-8">
        {/* Step Navigation now shows steps 3, 4, 5 */}
        <StepNavigation steps={displayedSteps} currentStep={step + 2} type="planner" />
        <div className="rounded-lg border border-border p-6 bg-card mb-24">
          {renderStep()}
        </div>
        {step === 1 && !requirements.projectOverview.projectName && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>Please provide your project name to continue.</span>
          </div>
        )}
      </div>
      {/* Fixed navigation at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-card p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {step > 1 && (
            <button onClick={handleBack} className="px-4 py-2 bg-muted text-muted-foreground rounded">
              Back
            </button>
          )}
          <button onClick={handleNext} className="ml-auto px-4 py-2 bg-primary text-primary-foreground rounded">
            {step === stepsArr.length ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerForm;
