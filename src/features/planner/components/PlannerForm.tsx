import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ProjectRequirements } from '../types/types';
import ProjectOverviewStep from '@/features/planner/components/steps/ProjectOverviewStep';
import WebsiteContentStep from '@/features/planner/components/steps/WebsiteContentStep';
import BusinessGoalsStep from '@/features/planner/components/steps/BusinessGoalsStep';
import FunctionalRequirementsStep from '@/features/planner/components/steps/FunctionalRequirementsStep';
import DesignPreferencesStep from '@/features/planner/components/steps/DesignPreferencesStep';
import TechnicalContextStep from '@/features/planner/components/steps/TechnicalContextStep';
import StepNavigation from '@/features/planner/components/StepNavigation';

interface PlannerFormProps {
  onSubmit: (data: ProjectRequirements) => void;
}

const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState<ProjectRequirements>({
    projectOverview: {
      projectName: '',
      industry: '',
      targetAudience: [],
      vision: '',
      timeline: '',
      budget: ''
    },
    businessGoals: {
      primaryObjective: '',
      keyMetrics: [],
      competitiveAdvantage: '',
      targetMarket: '',
      expectedGrowth: ''
    },
    functionalRequirements: {
      mustHaveFeatures: [],
      niceToHaveFeatures: [],
      userJourneys: [],
      dataRequirements: [],
      integrationNeeds: []
    },
    designPreferences: {
      brandGuidelines: { exists: false },
      inspirationalWebsites: [],
      colorPreferences: '',
      stylePreference: '',
      moodKeywords: [],
      userExperience: {
        accessibility: '',
        deviceSupport: [],
        performanceExpectations: ''
      }
    },
    technicalContext: {
      existingTech: [],
      securityRequirements: [],
      scalabilityNeeds: '',
      analyticsRequirements: [],
      seoRequirements: []
    }
  });

  // Array of step objects to define order and component mapping
  const steps = [
    { id: 1, name: 'Project Overview', component: <ProjectOverviewStep data={requirements.projectOverview} updateData={data => setRequirements(prev => ({ ...prev, projectOverview: data }))} /> },
    { id: 2, name: 'Website Content', component: <WebsiteContentStep data={requirements.websiteContent} updateData={data => setRequirements(prev => ({ ...prev, websiteContent: data }))} /> },
    { id: 3, name: 'Business Goals', component: <BusinessGoalsStep data={requirements.businessGoals} updateData={data => setRequirements(prev => ({ ...prev, businessGoals: data }))} /> },
    { id: 4, name: 'Features', component: <FunctionalRequirementsStep data={requirements.functionalRequirements} updateData={data => setRequirements(prev => ({ ...prev, functionalRequirements: data }))} /> },
    { id: 5, name: 'Design', component: <DesignPreferencesStep data={requirements.designPreferences} updateData={data => setRequirements(prev => ({ ...prev, designPreferences: data }))} /> },
    { id: 6, name: 'Technical', component: <TechnicalContextStep data={requirements.technicalContext} updateData={data => setRequirements(prev => ({ ...prev, technicalContext: data }))} /> },
  ];

  const handleSubmit = () => {
    // Optionally, you can generate an AI-friendly prompt here from the requirements.
    onSubmit(requirements);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-white mb-4">Project Requirements Planner</h1>
        <p className="text-gray-400">
          Provide detailed information about your project so that our AI can generate an optimized plan.
        </p>
      </div>
      
      <StepNavigation steps={steps} currentStep={step} />

      <div className="mb-8">{steps.find(s => s.id === step)?.component}</div>

      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (step < steps.length) {
              setStep(step + 1);
            } else {
              handleSubmit();
            }
          }}
          className="px-6 py-2 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors ml-auto"
        >
          {step === steps.length ? 'Generate Plan' : 'Next'}
        </button>
      </div>

      {/* Example of a validation message */}
      {!requirements.projectOverview.projectName && (
        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Please provide your project name to continue.</span>
        </div>
      )}
    </div>
  );
};

export default PlannerForm;
