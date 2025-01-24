// ClientPlanner/index.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BrandingForm from './steps/BrandingForm';
import LayoutForm from './steps/LayoutForm';
import FeaturesForm from './steps/FeaturesForm';
import ContentForm from './steps/ContentForm';
import ReviewPlan from './steps/ReviewPlan';

const ClientPlanner = () => {
  const { projectId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [planData, setPlanData] = useState({});

  const steps = [
    {
      id: 'branding',
      title: 'Brand & Style',
      component: BrandingForm,
      description: 'Define your visual identity'
    },
    {
      id: 'layout',
      title: 'Layout & Structure',
      component: LayoutForm,
      description: 'Design your user experience'
    },
    {
      id: 'features',
      title: 'Features & Functionality',
      component: FeaturesForm,
      description: 'Choose interactive elements'
    },
    {
      id: 'content',
      title: 'Content Strategy',
      component: ContentForm,
      description: 'Plan your content structure'
    },
    {
      id: 'review',
      title: 'Review & Finalize',
      component: ReviewPlan,
      description: 'Confirm your choices'
    }
  ];

  const handleStepSubmit = async (stepId: string, data: any) => {
    try {
      const response = await fetch(`/api/planner/plans/${projectId}/${stepId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        setPlanData(prev => ({ ...prev, [stepId]: data }));
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to save step data:', error);
    }
  };

  const CurrentStepComponent = steps[currentStep]?.component;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8 grid grid-cols-5 gap-4">
        {steps.map((step, idx) => (
          <div 
            key={step.id}
            className={`relative ${idx <= currentStep ? 'text-yellow-500' : 'text-gray-500'}`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${idx === currentStep ? 'border-yellow-500 bg-yellow-500/20' : 
                  idx < currentStep ? 'border-yellow-500 bg-yellow-500' : 
                  'border-gray-700 bg-gray-800'}
              `}>
                {idx + 1}
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`absolute top-4 left-full w-full h-0.5 
                ${idx < currentStep ? 'bg-yellow-500' : 'bg-gray-700'}`} 
              />
            )}
          </div>
        ))}
      </div>

      {/* Current Step */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-medium mb-2">{steps[currentStep].title}</h2>
        <p className="text-gray-400 mb-6">{steps[currentStep].description}</p>
        
        {CurrentStepComponent && (
          <CurrentStepComponent
            onSubmit={data => handleStepSubmit(steps[currentStep].id, data)}
            initialData={planData[steps[currentStep].id]}
          />
        )}
      </div>
    </div>
  );
};

export default ClientPlanner;