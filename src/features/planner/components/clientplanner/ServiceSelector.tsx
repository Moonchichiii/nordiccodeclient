// src/features/planner/components/clientplanner/ClientPlanner.tsx
import React, { useState } from 'react';
import { Package, Calendar, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { ServiceSelector } from './ServiceSelector';
import { CostCalculator } from './CostCalculator';
import { TimelineViewer } from './TimelineViewer';

interface PlanningStep {
  title: string;
  description: string;
  icon: any;
}

const steps: PlanningStep[] = [
  {
    title: 'Select Service',
    description: 'Choose your package',
    icon: Package
  },
  {
    title: 'Project Details',
    description: 'Configure requirements',
    icon: Calendar
  },
  {
    title: 'Review & Confirm',
    description: 'Finalize your plan',
    icon: CheckCircle2
  }
];

export const ClientPlanner: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [projectDetails, setProjectDetails] = useState({});

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ServiceSelector
            onSelect={setSelectedPackage}
            selectedPackage={selectedPackage}
          />
        );
      case 1:
        return (
          <CostCalculator
            selectedPackage={selectedPackage}
            onUpdateDetails={setProjectDetails}
          />
        );
      case 2:
        return (
          <TimelineViewer
            package={selectedPackage}
            details={projectDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 bg-gray-900 p-6 rounded-xl">
      {/* Progress Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={index} className="flex-1 relative">
              {index > 0 && (
                <div 
                  className={`absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 ${
                    isCompleted ? 'bg-yellow-500' : 'bg-gray-700'
                  }`} 
                  style={{ left: '-50%', right: '50%' }}
                />
              )}

              <div className="relative flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-yellow-500 text-gray-900' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-700 text-gray-400'}
                `}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-yellow-500' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] bg-gray-800 rounded-xl p-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 0}
          className="px-6 py-2 flex items-center space-x-2 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <button
          onClick={() => setCurrentStep(prev => prev + 1)}
          disabled={currentStep === steps.length - 1}
          className="px-6 py-2 flex items-center space-x-2 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:opacity-50"
        >
          <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next'}</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ClientPlanner;