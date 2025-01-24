import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRight, Code, Layout, Database } from 'lucide-react';

const planningSteps = [
  {
    id: 'requirements',
    title: 'Requirements Analysis',
    description: 'Define project scope and requirements'
  },
  {
    id: 'design',
    title: 'Design Planning',
    description: 'Plan UI/UX and architecture'
  },
  {
    id: 'technical',
    title: 'Technical Specifications',
    description: 'Define technical implementation details'
  }
];

const PlannerView = () => {
  const { projectId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [planningData, setPlanningData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanningSubmit = async (stepData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/planner/plans/${projectId}/${planningSteps[currentStep].id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stepData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlanningData(prev => ({...prev, [planningSteps[currentStep].id]: data}));
        if (currentStep < planningSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Planning complete, move to payment
          window.location.href = `/dashboard/orders/create?project=${projectId}`;
        }
      }
    } catch (error) {
      console.error('Planning step failed:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {planningSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex flex-col items-center ${
              index <= currentStep ? 'text-yellow-500' : 'text-gray-500'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                           ${index <= currentStep ? 'bg-yellow-500/20 border-yellow-500' : 
                                                  'bg-gray-800 border-gray-700'}
                           border-2 transition-colors duration-300`}>
                {index + 1}
              </div>
              <span className="mt-2 text-sm">{step.title}</span>
            </div>
            {index < planningSteps.length - 1 && (
              <div className={`w-24 h-0.5 mx-4 ${
                index < currentStep ? 'bg-yellow-500' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Planning Form */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handlePlanningSubmit(Object.fromEntries(formData));
        }}>
          {/* Form fields will change based on currentStep */}
          <div className="space-y-4">
            {/* Example fields */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-yellow-500 text-gray-900 rounded-lg
                       hover:bg-yellow-400 disabled:opacity-50 transition-all duration-300"
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlannerView;