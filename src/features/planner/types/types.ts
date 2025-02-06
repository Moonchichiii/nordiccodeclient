export interface Requirements {
  projectOverview: {
    projectName: string;
    industry: string;
    targetAudience: string[];
    vision: string;
    timeline: string;  
  };
  businessGoals: {
    primaryObjective: string;
    keyMetrics: string[];
    competitiveAdvantage: string;
    targetMarket: string;
    expectedGrowth: string;
  };
  functionalRequirements: {
    mustHaveFeatures: string[];
    niceToHaveFeatures: string[];
    userJourneys: string[];
    dataRequirements: string[];
    integrationNeeds: string[];
  };
  designPreferences: {
    brandGuidelines: {
      exists: boolean;
      description?: string;
    };
    inspirationalWebsites: string[];
    colorPreferences: string;
    stylePreference: string;
    moodKeywords: string[];
    userExperience: {
      accessibility: string;
      deviceSupport: string[];
      performanceExpectations: string;
    };
  };
  technicalContext: {
    existingTech: string[];
    securityRequirements: string[];
    scalabilityNeeds: string;
    analyticsRequirements: string[];
    seoRequirements: string[];
  };
  websiteContent: {
    primaryPurpose: string[];
    homepageSections: string[];
    requiredPages: string[];
    contentTypes: string[];
    brandPersonality: string;
    colorPalette: string;
    fontPairing: string;
  };
}

export const initialRequirements: Requirements = {
  projectOverview: {
    projectName: '',
    industry: '',
    targetAudience: [],
    vision: '',
    timeline: '',
    budget: '',
  },
  businessGoals: {
    primaryObjective: '',
    keyMetrics: [],
    competitiveAdvantage: '',
    targetMarket: '',
    expectedGrowth: '',
  },
  functionalRequirements: {
    mustHaveFeatures: [],
    niceToHaveFeatures: [],
    userJourneys: [],
    dataRequirements: [],
    integrationNeeds: [],
  },
  designPreferences: {
    brandGuidelines: {
      exists: false,
      description: '',
    },
    inspirationalWebsites: [],
    colorPreferences: '',
    stylePreference: '',
    moodKeywords: [],
    userExperience: {
      accessibility: '',
      deviceSupport: [],
      performanceExpectations: '',
    },
  },
  technicalContext: {
    existingTech: [],
    securityRequirements: [],
    scalabilityNeeds: '',
    analyticsRequirements: [],
    seoRequirements: [],
  },
  websiteContent: {
    primaryPurpose: [],
    homepageSections: [],
    requiredPages: [],
    contentTypes: [],
    brandPersonality: '',
    colorPalette: '',
    fontPairing: '',
  },
};
