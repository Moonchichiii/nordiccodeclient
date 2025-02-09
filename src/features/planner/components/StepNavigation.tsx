import React from 'react';
import { Check } from 'lucide-react';

interface StepNavigationProps {
  steps: { id: number; name: string }[];
  currentStep: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ steps, currentStep }) => {
  return (
    <div className="relative">
      <div className="absolute top-4 left-0 right-0 h-px bg-border" aria-hidden="true" />
      
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <li key={step.id} className="relative">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`
                      h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors
                      ${isCompleted 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : isCurrent
                          ? 'border-primary bg-background text-primary'
                          : 'border-muted bg-background text-muted-foreground'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <span 
                    className={`
                      text-xs font-medium hidden sm:block absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap
                      ${isCurrent ? 'text-primary' : 'text-muted-foreground'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default StepNavigation;