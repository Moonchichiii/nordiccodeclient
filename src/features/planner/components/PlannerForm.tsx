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
    onSubmit(requirements);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-light text-foreground">Project Requirements Planner</h2>
        <p className="text-sm text-muted-foreground">
          Provide detailed information about your project so that our AI can generate an optimized plan.
        </p>
      </div>
      
      <StepNavigation steps={steps} currentStep={step} />

      <div className="rounded-lg border border-border/50 bg-card p-6">
        {steps.find(s => s.id === step)?.component}
      </div>

      <div className="flex justify-between items-center pt-4">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 ml-auto"
        >
          {step === steps.length ? 'Generate Plan' : 'Next'}
        </button>
      </div>

      {!requirements.projectOverview.projectName && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Please provide your project name to continue.</span>
        </div>
      )}
    </div>
  );
};

export default PlannerForm;