import React from 'react';

export interface WebsiteContent {
  primaryPurpose: string[];
  homepageSections: string[];
  requiredPages: string[];
  brandPersonality: string;
  fontPairing: string;
}

interface WebsiteContentStepProps {
  websiteContent: WebsiteContent;
  onChange: (updated: WebsiteContent) => void;
}

const primaryPurposeOptions = [
  'Promote a Physical Business',
  'Sell Products',
  'Get Appointments',
  'Sell Digital Products',
  'Offer Services',
  'Showcase Work/Portfolio',
  'Publish Blog/Media',
  'Collect Donations',
  'Build Community',
];

const homepageSectionsOptions = [
  'Hero/Intro',
  'About',
  'Services/Products',
  'Testimonials',
  'Contact',
  'Blog',
];

const requiredPagesOptions = [
  'Home',
  'About',
  'Services',
  'Products',
  'Contact',
  'FAQ',
  'Terms & Conditions',
  'Privacy Policy',
];

const brandPersonalityOptions = [
  'Professional',
  'Playful',
  'Sophisticated',
  'Bold',
  'Friendly',
  'Innovative',
];

const fontPairingOptions = [
  'Roboto (Professional)',
  'Shrikhand (Playful)',
  'Libre Baskerville (Sophisticated)',
  'Manrope (Friendly)',
  'Anton (Bold)',
  'Space Grotesk (Innovative)',
];

const WebsiteContentStep: React.FC<WebsiteContentStepProps> = ({ websiteContent, onChange }) => {
  const toggleArrayItem = (field: keyof WebsiteContent, value: string) => {
    const current = websiteContent[field] as string[];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    onChange({ ...websiteContent, [field]: updated });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-white mb-6">Website Content</h2>

      {/* Primary Purpose */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Primary Purpose (choose all that apply)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {primaryPurposeOptions.map((purpose) => (
            <label key={purpose} className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={websiteContent.primaryPurpose.includes(purpose)}
                onChange={() => toggleArrayItem('primaryPurpose', purpose)}
                className="form-checkbox text-yellow-500"
              />
              <span className="text-gray-300 text-sm">{purpose}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Homepage Sections */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Homepage Sections
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {homepageSectionsOptions.map((section) => (
            <label key={section} className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={websiteContent.homepageSections.includes(section)}
                onChange={() => toggleArrayItem('homepageSections', section)}
                className="form-checkbox text-yellow-500"
              />
              <span className="text-gray-300 text-sm">{section}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Required Pages */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Required Pages
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {requiredPagesOptions.map((page) => (
            <label key={page} className="flex items-center space-x-2 p-3 bg-gray-800/50 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={websiteContent.requiredPages.includes(page)}
                onChange={() => toggleArrayItem('requiredPages', page)}
                className="form-checkbox text-yellow-500"
              />
              <span className="text-gray-300 text-sm">{page}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Personality */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Brand Personality
        </label>
        <select
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          value={websiteContent.brandPersonality}
          onChange={(e) =>
            onChange({ ...websiteContent, brandPersonality: e.target.value })
          }
        >
          <option value="">Select Personality</option>
          {brandPersonalityOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Font Pairing */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Font Pairing Style
        </label>
        <select
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          value={websiteContent.fontPairing}
          onChange={(e) =>
            onChange({ ...websiteContent, fontPairing: e.target.value })
          }
        >
          <option value="">Select Font Style</option>
          {fontPairingOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WebsiteContentStep;
