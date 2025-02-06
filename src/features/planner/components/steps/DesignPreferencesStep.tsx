import React from 'react';

export interface DesignPreferences {
  brandGuidelines: {
    exists: boolean;
    description: string;
  };
  inspirationalWebsites: string[]; // comma-separated URLs
  colorPreferences: string;
  stylePreference: string;
  moodKeywords: string[]; // comma-separated keywords
  userExperience: {
    accessibility: string;
    deviceSupport: string[]; // e.g., Desktop, Mobile, Tablet
    performanceExpectations: string;
  };
}

interface DesignPreferencesStepProps {
  designPreferences: DesignPreferences;
  onChange: (updated: DesignPreferences) => void;
}

const deviceOptions = ['Desktop', 'Tablet', 'Mobile', 'Large Displays'];
const styleOptions = [
  'Minimal & Clean',
  'Modern & Bold',
  'Classic & Professional',
  'Playful & Creative',
  'Luxury & Elegant',
  'Technical & Functional',
];

const DesignPreferencesStep: React.FC<DesignPreferencesStepProps> = ({
  designPreferences,
  onChange,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-white mb-6">Design Preferences</h2>

      {/* Brand Guidelines */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Do you have existing brand guidelines?
        </label>
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={designPreferences.brandGuidelines.exists}
            onChange={(e) =>
              onChange({
                ...designPreferences,
                brandGuidelines: {
                  ...designPreferences.brandGuidelines,
                  exists: e.target.checked,
                },
              })
            }
            className="form-checkbox text-yellow-500"
          />
          <span className="text-gray-300">Yes</span>
        </label>
        {designPreferences.brandGuidelines.exists && (
          <textarea
            className="mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white h-24"
            placeholder="Describe your brand guidelines or provide a link..."
            value={designPreferences.brandGuidelines.description}
            onChange={(e) =>
              onChange({
                ...designPreferences,
                brandGuidelines: {
                  ...designPreferences.brandGuidelines,
                  description: e.target.value,
                },
              })
            }
          />
        )}
      </div>

      {/* Inspirational Websites */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Inspirational Websites (comma-separated URLs)
        </label>
        <input
          type="text"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          placeholder="e.g., https://example.com, https://another.com"
          value={designPreferences.inspirationalWebsites.join(', ')}
          onChange={(e) =>
            onChange({
              ...designPreferences,
              inspirationalWebsites: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
            })
          }
        />
      </div>

      {/* Color Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Color Preferences
        </label>
        <input
          type="text"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          placeholder="Enter preferred colors or palette"
          value={designPreferences.colorPreferences}
          onChange={(e) =>
            onChange({ ...designPreferences, colorPreferences: e.target.value })
          }
        />
      </div>

      {/* Style Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Design Style Preference
        </label>
        <select
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          value={designPreferences.stylePreference}
          onChange={(e) =>
            onChange({ ...designPreferences, stylePreference: e.target.value })
          }
        >
          <option value="">Select a style</option>
          {styleOptions.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
      </div>

      {/* Mood Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Mood Keywords (comma-separated)
        </label>
        <input
          type="text"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          placeholder="e.g., energetic, calm, innovative"
          value={designPreferences.moodKeywords.join(', ')}
          onChange={(e) =>
            onChange({
              ...designPreferences,
              moodKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
            })
          }
        />
      </div>

      {/* User Experience */}
      <div>
        <h3 className="text-lg font-light text-yellow-500 mb-4">User Experience</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Accessibility Standards
            </label>
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              placeholder="e.g., WCAG AA"
              value={designPreferences.userExperience.accessibility}
              onChange={(e) =>
                onChange({
                  ...designPreferences,
                  userExperience: {
                    ...designPreferences.userExperience,
                    accessibility: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Supported Devices
            </label>
            <div className="flex flex-wrap gap-2">
              {deviceOptions.map((device) => (
                <label key={device} className="flex items-center space-x-2 bg-gray-800 rounded-lg p-2">
                  <input
                    type="checkbox"
                    checked={designPreferences.userExperience.deviceSupport.includes(device)}
                    onChange={(e) => {
                      const updatedDevices = e.target.checked
                        ? [...designPreferences.userExperience.deviceSupport, device]
                        : designPreferences.userExperience.deviceSupport.filter(d => d !== device);
                      onChange({
                        ...designPreferences,
                        userExperience: {
                          ...designPreferences.userExperience,
                          deviceSupport: updatedDevices,
                        },
                      });
                    }}
                    className="form-checkbox text-yellow-500"
                  />
                  <span className="text-gray-300 text-sm">{device}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Performance Expectations
            </label>
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              placeholder="e.g., Load time under 2 seconds"
              value={designPreferences.userExperience.performanceExpectations}
              onChange={(e) =>
                onChange({
                  ...designPreferences,
                  userExperience: {
                    ...designPreferences.userExperience,
                    performanceExpectations: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPreferencesStep;
