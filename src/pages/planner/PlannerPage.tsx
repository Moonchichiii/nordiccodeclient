import React, { useState } from 'react';
import {
  Target,
  Users,
  Briefcase,
  Globe,
  PieChart,
  FileText,
  Code,
  CheckSquare,
  AlertTriangle,
} from 'lucide-react';
import { useSubmitPlanner } from '@/features/planner/usePlanner';
import { toast } from 'react-toastify';

interface Requirements {
  business: {
    industry: string;
    companySize: string;
    businessGoals: {
      primary: string;
      successMetrics: string[];
    };
  };
  users: {
    demographics: {
      ageRange: string[];
      techSavviness: string;
    };
    behaviors: {
      keyActions: string[];
    };
  };
  // Additional sections (content, technical, etc.) can be added here.
}

const initialRequirements: Requirements = {
  business: {
    industry: '',
    companySize: '',
    businessGoals: {
      primary: '',
      successMetrics: [],
    },
  },
  users: {
    demographics: {
      ageRange: [],
      techSavviness: '',
    },
    behaviors: {
      keyActions: [],
    },
  },
};

const RequirementsBuilder: React.FC = () => {
  // Multi-step form management: step state controls the current page.
  const [step, setStep] = useState<number>(1);
  // Local state for the entire requirements data.
  const [requirements, setRequirements] = useState<Requirements>(initialRequirements);
  // React Query mutation hook to submit the planner data.
  const { mutateAsync } = useSubmitPlanner();

  // Step 1: Business Context
  const renderBusinessContext = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-light text-white mb-6">Business Context</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Selection */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
            value={requirements.business.industry}
            onChange={(e) =>
              setRequirements((prev) => ({
                ...prev,
                business: { ...prev.business, industry: e.target.value },
              }))
            }
          >
            <option value="">Select Industry</option>
            <option value="ecommerce">E-commerce</option>
            <option value="saas">SaaS</option>
            <option value="service">Professional Services</option>
            <option value="healthcare">Healthcare</option>
            <option value="education">Education</option>
            <option value="nonprofit">Non-profit</option>
          </select>
        </div>
        {/* Company Size */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
            value={requirements.business.companySize}
            onChange={(e) =>
              setRequirements((prev) => ({
                ...prev,
                business: { ...prev.business, companySize: e.target.value },
              }))
            }
          >
            <option value="">Select Size</option>
            <option value="startup">Startup (1-10)</option>
            <option value="small">Small (11-50)</option>
            <option value="medium">Medium (51-200)</option>
            <option value="large">Large (201+)</option>
          </select>
        </div>
      </div>
      {/* Business Goals */}
      <div className="p-6 rounded-xl bg-gray-800/50">
        <h3 className="text-lg font-light text-yellow-500 mb-4">Primary Business Goal</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'sales', label: 'Increase Sales', icon: PieChart },
            { id: 'leads', label: 'Generate Leads', icon: Target },
            { id: 'brand', label: 'Build Brand', icon: Briefcase },
            { id: 'service', label: 'Improve Service', icon: Users },
          ].map((goal) => (
            <button
              key={goal.id}
              className={`p-4 rounded-lg text-left transition-all ${
                requirements.business.businessGoals.primary === goal.id
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() =>
                setRequirements((prev) => ({
                  ...prev,
                  business: {
                    ...prev.business,
                    businessGoals: { ...prev.business.businessGoals, primary: goal.id },
                  },
                }))
              }
            >
              <goal.icon className="w-6 h-6 mb-2" />
              <span className="block text-sm">{goal.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Success Metrics */}
      <div className="p-6 rounded-xl bg-gray-800/50">
        <h3 className="text-lg font-light text-yellow-500 mb-4">Success Metrics</h3>
        <div className="space-y-3">
          {[
            'Monthly Revenue Growth',
            'Lead Generation Rate',
            'Conversion Rate',
            'Average Order Value',
            'Customer Satisfaction',
            'Website Traffic',
          ].map((metric) => (
            <label key={metric} className="flex items-center space-x-3 text-gray-300">
              <input
                type="checkbox"
                checked={requirements.business.businessGoals.successMetrics.includes(metric)}
                onChange={(e) => {
                  const metrics = e.target.checked
                    ? [...requirements.business.businessGoals.successMetrics, metric]
                    : requirements.business.businessGoals.successMetrics.filter((m) => m !== metric);
                  setRequirements((prev) => ({
                    ...prev,
                    business: {
                      ...prev.business,
                      businessGoals: { ...prev.business.businessGoals, successMetrics: metrics },
                    },
                  }));
                }}
                className="form-checkbox text-yellow-500"
              />
              <span>{metric}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Step 2: User Behavior & Demographics
  const renderUserBehavior = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-light text-white mb-6">User Behavior & Demographics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Groups */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <h3 className="text-lg font-light text-yellow-500 mb-4">Age Groups</h3>
          <div className="space-y-3">
            {['18-24', '25-34', '35-44', '45-54', '55+'].map((age) => (
              <label key={age} className="flex items-center space-x-3 text-gray-300">
                <input
                  type="checkbox"
                  checked={requirements.users.demographics.ageRange.includes(age)}
                  onChange={(e) => {
                    const ages = e.target.checked
                      ? [...requirements.users.demographics.ageRange, age]
                      : requirements.users.demographics.ageRange.filter((a) => a !== age);
                    setRequirements((prev) => ({
                      ...prev,
                      users: {
                        ...prev.users,
                        demographics: { ...prev.users.demographics, ageRange: ages },
                      },
                    }));
                  }}
                  className="form-checkbox text-yellow-500"
                />
                <span>{age}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Tech Savviness */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <h3 className="text-lg font-light text-yellow-500 mb-4">Tech Savviness</h3>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
            value={requirements.users.demographics.techSavviness}
            onChange={(e) =>
              setRequirements((prev) => ({
                ...prev,
                users: {
                  ...prev.users,
                  demographics: { ...prev.users.demographics, techSavviness: e.target.value },
                },
              }))
            }
          >
            <option value="">Select Level</option>
            <option value="basic">Basic Users</option>
            <option value="intermediate">Intermediate Users</option>
            <option value="advanced">Advanced Users</option>
            <option value="mixed">Mixed Audience</option>
          </select>
        </div>
      </div>
      {/* Key User Actions */}
      <div className="p-6 rounded-xl bg-gray-800/50">
        <h3 className="text-lg font-light text-yellow-500 mb-4">Key User Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'purchase', label: 'Make Purchase', icon: Briefcase },
            { id: 'contact', label: 'Contact Business', icon: Users },
            { id: 'subscribe', label: 'Subscribe', icon: Globe },
            { id: 'download', label: 'Download Content', icon: FileText },
            { id: 'share', label: 'Share Content', icon: Target },
            { id: 'search', label: 'Search Products', icon: Code },
          ].map((action) => (
            <button
              key={action.id}
              className={`p-4 rounded-lg text-left transition-all ${
                requirements.users.behaviors.keyActions.includes(action.id)
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => {
                const actions = requirements.users.behaviors.keyActions.includes(action.id)
                  ? requirements.users.behaviors.keyActions.filter((a) => a !== action.id)
                  : [...requirements.users.behaviors.keyActions, action.id];
                setRequirements((prev) => ({
                  ...prev,
                  users: {
                    ...prev.users,
                    behaviors: { ...prev.users.behaviors, keyActions: actions },
                  },
                }));
              }}
            >
              <action.icon className="w-6 h-6 mb-2" />
              <span className="block text-sm">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Define the steps of the multipage form.
  const steps = [
    { id: 1, name: 'Business Context', component: renderBusinessContext },
    { id: 2, name: 'User Behavior', component: renderUserBehavior },
    // Additional steps can be appended here.
  ];

  // React Query mutation hook for submitting the requirements.
  const { mutateAsync } = useSubmitPlanner();

  // Submit the collected requirements to the backend.
  const handleSubmit = async () => {
    try {
      const submission = await mutateAsync({ submission_data: requirements });
      toast.success('Submission successful!');
      console.log('Submission result:', submission);
      // Optionally, navigate or display the AI-generated summaries.
    } catch (error: any) {
      toast.error(`Submission failed: ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-900">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-white mb-4">Project Requirements</h1>
        <p className="text-gray-400">
          Let's gather detailed information about your project.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-xs">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= s.id ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {s.id}
            </div>
          ))}
        </div>
      </div>

      {/* Render current step */}
      {steps.find((s) => s.id === step)?.component()}

      {/* Navigation buttons */}
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
          className="px-6 py-2 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors ml-auto flex items-center gap-2"
        >
          <span>{step === steps.length ? 'Submit' : 'Next'}</span>
          {step === steps.length && <CheckSquare className="w-4 h-4" />}
        </button>
      </div>

      {/* Warning message if required field is missing */}
      {requirements.business.industry === '' && (
        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Please select an industry to continue</span>
        </div>
      )}
    </div>
  );
};

export default RequirementsBuilder;
