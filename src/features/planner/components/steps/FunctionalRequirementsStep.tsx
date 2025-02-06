import React from 'react';

export interface FunctionalRequirements {
  mustHaveFeatures: string[];
  niceToHaveFeatures: string[];
  userJourneys: string[]; // You could also choose to use a textarea with comma-separated items.
  dataRequirements: string[];
  integrationNeeds: string[];
}

interface FunctionalRequirementsStepProps {
  functionalRequirements: FunctionalRequirements;
  onChange: (updated: FunctionalRequirements) => void;
}

const mustHaveOptions = [
  'User Authentication',
  'Profile Management',
  'Search Functionality',
  'Payment Processing',
  'Content Management',
  'Analytics Dashboard',
  'API Integration',
  'Mobile Responsiveness',
  'Multi-language Support',
  'Automated Emails'
];

const niceToHaveOptions = [
  'Real-time Chat',
  'Advanced Reporting',
  'Custom Dashboards',
  'Social Media Integration',
  'Advanced Search Filters',
  'Workflow Automation',
];

const FunctionalRequirementsStep: React.FC<FunctionalRequirementsStepProps> = ({
  functionalRequirements,
  onChange,
}) => {
  const updateArrayField = (
    field: keyof Omit<FunctionalRequirements, 'userJourneys' | 'dataRequirements' | 'integrationNeeds'>,
    value: string,
    checked: boolean
  ) => {
    const currentArray = functionalRequirements[field] as string[];
    const updated = checked
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    onChange({ ...functionalRequirements, [field]: updated });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-white mb-6">Functional Requirements</h2>

      {/* Must-Have Features */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Must-Have Features</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {mustHaveOptions.map((feature) => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={functionalRequirements.mustHaveFeatures.includes(feature)}
                onChange={(e) => updateArrayField('mustHaveFeatures', feature, e.target.checked)}
                className="form-checkbox text-yellow-500"
              />
              <span className="text-gray-300 text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Nice-to-Have Features */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nice-to-Have Features</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {niceToHaveOptions.map((feature) => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={functionalRequirements.niceToHaveFeatures.includes(feature)}
                onChange={(e) => updateArrayField('niceToHaveFeatures', feature, e.target.checked)}
                className="form-checkbox text-yellow-500"
              />
              <span className="text-gray-300 text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* User Journeys */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          User Journeys (separate multiple items with commas)
        </label>
        <input
          type="text"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          placeholder="e.g., Registration flow, Purchase flow, etc."
          value={functionalRequirements.userJourneys.join(', ')}
          onChange={(e) =>
            onChange({
              ...functionalRequirements,
              userJourneys: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </div>

      {/* Data Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Data Requirements (separate multiple items with commas)
        </label>
        <input
          type="text"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          placeholder="e.g., User Data, Transaction Records, etc."
          value={functionalRequirements.dataRequirements.join(', ')}
          onChange={(e) =>
            onChange({
              ...functionalRequirements,
              dataRequirements: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </div>

      {/* Integration Needs */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Integration Needs (separate multiple items with commas)
        </label>
        <input
          type="text"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          placeholder="e.g., CRM, Payment Gateway, Email Service, etc."
          value={functionalRequirements.integrationNeeds.join(', ')}
          onChange={(e) =>
            onChange({
              ...functionalRequirements,
              integrationNeeds: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </div>
    </div>
  );
};

export default FunctionalRequirementsStep;
