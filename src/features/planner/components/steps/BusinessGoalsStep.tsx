import React from 'react';

export interface BusinessGoals {
  primaryObjective: string;
  keyMetrics: string[];
  competitiveAdvantage: string;
  targetMarket: string;
  expectedGrowth: string;
}

interface BusinessGoalsStepProps {
  businessGoals: BusinessGoals;
  onChange: (updated: BusinessGoals) => void;
}

const keyMetricsOptions = [
  'Monthly Active Users',
  'Conversion Rate',
  'Average Order Value',
  'User Retention Rate',
  'Customer Satisfaction',
  'Revenue Growth',
];

const BusinessGoalsStep: React.FC<BusinessGoalsStepProps> = ({ businessGoals, onChange }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-white mb-6">Business Goals</h2>

      {/* Primary Business Objective */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Primary Business Objective
        </label>
        <select
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          value={businessGoals.primaryObjective}
          onChange={(e) =>
            onChange({ ...businessGoals, primaryObjective: e.target.value })
          }
        >
          <option value="">Select an objective</option>
          <option value="increaseRevenue">Increase Revenue</option>
          <option value="generateLeads">Generate Leads</option>
          <option value="buildBrand">Build Brand Awareness</option>
          <option value="boostEngagement">Boost User Engagement</option>
          <option value="retainCustomers">Retain Customers</option>
        </select>
      </div>

      {/* Key Success Metrics */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Key Success Metrics
        </label>
        <div className="space-y-2">
          {keyMetricsOptions.map((metric) => (
            <label key={metric} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={businessGoals.keyMetrics.includes(metric)}
                onChange={(e) => {
                  const updatedMetrics = e.target.checked
                    ? [...businessGoals.keyMetrics, metric]
                    : businessGoals.keyMetrics.filter((m) => m !== metric);
                  onChange({ ...businessGoals, keyMetrics: updatedMetrics });
                }}
                className="form-checkbox text-yellow-500"
              />
              <span className="text-gray-300 text-sm">{metric}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Competitive Advantage */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Competitive Advantage
        </label>
        <textarea
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white h-24"
          placeholder="What sets your project apart from competitors?"
          value={businessGoals.competitiveAdvantage}
          onChange={(e) =>
            onChange({ ...businessGoals, competitiveAdvantage: e.target.value })
          }
        />
      </div>

      {/* Target Market */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Market
        </label>
        <input
          type="text"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          placeholder="Define your target market (e.g., demographics, geography)"
          value={businessGoals.targetMarket}
          onChange={(e) =>
            onChange({ ...businessGoals, targetMarket: e.target.value })
          }
        />
      </div>

      {/* Expected Growth */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Expected Growth
        </label>
        <select
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          value={businessGoals.expectedGrowth}
          onChange={(e) =>
            onChange({ ...businessGoals, expectedGrowth: e.target.value })
          }
        >
          <option value="">Select Expected Growth</option>
          <option value="steady">Steady (10-20% annually)</option>
          <option value="aggressive">Aggressive (20-50% annually)</option>
          <option value="hypergrowth">Hypergrowth (50%+ annually)</option>
        </select>
      </div>
    </div>
  );
};

export default BusinessGoalsStep;
