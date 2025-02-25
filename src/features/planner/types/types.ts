export type BrandPersonality =
  | 'Professional'
  | 'Playful'
  | 'Sophisticated'
  | 'Bold'
  | 'Friendly'
  | 'Innovative';

export type AccessibilityOptions = 'standard' | 'enhanced' | 'full';
export type PerformanceOptions = 'standard' | 'high' | 'premium';
export type ResponsiveOptions = 'mobile-first' | 'desktop-first' | 'unified';

export interface Requirements {
  projectOverview: {
    projectName: string;
    industry: string;
    vision: string;
    timeline: string;
  };
  businessGoals: {
    primaryObjective: string;
    primaryPurpose: string[];
    homepageSections: string[];
  };
  designPreferences: {
    brandPersonality: BrandPersonality | '';
    brandGuidelines: {
      exists: boolean;
      description?: string;
    };
    colorPalette: string;
    stylePreference: string;
    fontPairing: string;
    userExperience: {
      accessibility: AccessibilityOptions;
      deviceSupport: string[];
      performanceExpectations: string;
      performance: PerformanceOptions;
      responsive: ResponsiveOptions;
    };
  };
}

export const initialRequirements: Requirements = {
  projectOverview: {
    projectName: '',
    industry: '',
    vision: '',
    timeline: '',
  },
  businessGoals: {
    primaryObjective: '',
    primaryPurpose: [],
    homepageSections: [],
  },
  designPreferences: {
    brandPersonality: '',
    brandGuidelines: { exists: false, description: '' },
    colorPalette: '',
    stylePreference: '',
    fontPairing: '',
    userExperience: {
      // Preset defaults so that no field is empty
      accessibility: 'standard',
      deviceSupport: [],
      performanceExpectations: '',
      performance: 'standard',
      responsive: 'unified',
    },
  },
};
