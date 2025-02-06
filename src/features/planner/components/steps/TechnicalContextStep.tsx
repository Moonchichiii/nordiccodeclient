import React from 'react';

export interface TechnicalContext {
  existingTech: string[];
  securityRequirements: string[];
  scalabilityNeeds: string;
  analyticsRequirements: string[];
  seoRequirements: string[];
}

interface TechnicalContextStepProps {
  technicalContext: TechnicalContext;
  onChange: (updated: TechnicalContext) => void;
}

const existingTechOptions = [
  'Legacy System Integration',
  'Microservices',
  'Serverless Architecture',
  'Containerization'
];

const securityOptions = [
  'User Authentication',
  'Data Encryption',
  'SSL Certificates',
  'GDPR Compliance',
  'Password Policies',
  'Two-Factor Authentication',
  'API Security',
  'Regular Security Audits'
];

const scalabilityOptions = [
  { value: 'basic', label: 'Basic (Up to 1,000 daily users)' },
  { value: 'medium', label: 'Medium (1,000-10,000 daily users)' },
  { value: 'high', label: 'High (10,000-100,000 daily users)' },
  { value: 'enterprise', label: 'Enterprise (100,000+ daily users)' }
];

const analyticsOptions = [
  'Traffic Analysis',
  'User Behavior Tracking',
  'Conversion Rate Monitoring',
  'Real-Time Reporting'
];

const seoOptions = [
  'Meta Tags Optimization',
  'Site Performance',
  'Mobile Friendliness',
  'URL Structure',
  'Sitemap Generation',
  'Schema Markup',
  'Analytics Integration'
];

const TechnicalContextStep: React.FC<TechnicalContextStepProps> = ({ technicalContext, onChange }) => {
  // Generic handler for checkbox updates
  const handleCheckboxChange = (
    option: string,
    key: keyof Pick<TechnicalContext, 'existingTech' | 'securityRequirements' | 'analyticsRequirements' | 'seoRequirements'>
  ) => {
    const currentValues = technicalContext[key];
    const updatedValues = currentValues.includes(option)
      ? currentValues.filter(v => v !== option)
      : [...currentValues, option];
    onChange({ ...technicalContext, [key]: updatedValues });
  };

  // Handler for scalability select input
  const handleScalabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...technicalContext, scalabilityNeeds: e.target.value });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-white mb-6">Technical Context</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Existing Technology */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <h3 className="text-lg font-light text-yellow-500 mb-4">Existing Technology</h3>
          <div className="space-y-2">
            {existingTechOptions.map(option => (
              <label key={option} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={technicalContext.existingTech.includes(option)}
                  onChange={() => handleCheckboxChange(option, 'existingTech')}
                  className="form-checkbox text-yellow-500"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security Requirements */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <h3 className="text-lg font-light text-yellow-500 mb-4">Security Requirements</h3>
          <div className="space-y-2">
            {securityOptions.map(option => (
              <label key={option} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={technicalContext.securityRequirements.includes(option)}
                  onChange={() => handleCheckboxChange(option, 'securityRequirements')}
                  className="form-checkbox text-yellow-500"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Scalability Needs */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <h3 className="text-lg font-light text-yellow-500 mb-4">Scalability Needs</h3>
          <select
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
            value={technicalContext.scalabilityNeeds}
            onChange={handleScalabilityChange}
          >
            <option value="">Select Scalability Level</option>
            {scalabilityOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Analytics Requirements */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <h3 className="text-lg font-light text-yellow-500 mb-4">Analytics Requirements</h3>
          <div className="space-y-2">
            {analyticsOptions.map(option => (
              <label key={option} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={technicalContext.analyticsRequirements.includes(option)}
                  onChange={() => handleCheckboxChange(option, 'analyticsRequirements')}
                  className="form-checkbox text-yellow-500"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SEO Requirements */}
        <div className="p-6 rounded-xl bg-gray-800/50">
          <h3 className="text-lg font-light text-yellow-500 mb-4">SEO Requirements</h3>
          <div className="space-y-2">
            {seoOptions.map(option => (
              <label key={option} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={technicalContext.seoRequirements.includes(option)}
                  onChange={() => handleCheckboxChange(option, 'seoRequirements')}
                  className="form-checkbox text-yellow-500"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalContextStep;
