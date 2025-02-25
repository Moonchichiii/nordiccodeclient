import axios from '@/lib/axios';
import { Requirements } from '@/features/planner/types/types';
import { PackageData, Addon } from '@/features/projects/types/types';

export interface ProjectContext {
  selectedPackage: PackageData;
  selectedAddons: Addon[];
  totalPrice: number;
}

export interface PlannerSubmissionResponse {
  planner: {
    client_summary: string;
    website_template: string;
    developer_notes: string | Record<string, any>;
  };
  project: {
    id: number;
    title: string;
    package: {
      type: string;
      name: string;
      price_eur: number;
      features: string[];
    };
    addons: Array<{
      id: string;
      title: string;
      price_eur: number;
    }>;
    total_price_eur: number;
  };
}

export const plannerApi = {
  submitPlannerData: async (
    projectId: number,
    requirements: Requirements,
    projectContext: ProjectContext
  ): Promise<PlannerSubmissionResponse> => {
    try {
      console.group('Planner Submission Attempt');
      console.log('Project ID:', projectId);
      console.log('Submission Data:', requirements);
      console.log('Project Context:', projectContext);

      // Build a payload that exactly matches the fields collected by the UI.
      const exactRequirements = {
        projectOverview: {
          projectName: requirements.projectOverview.projectName || '',
          industry: requirements.projectOverview.industry || '',
          vision: requirements.projectOverview.vision || '',
          timeline: requirements.projectOverview.timeline || '',
        },
        businessGoals: {
          primaryObjective: requirements.businessGoals.primaryObjective || '',
          primaryPurpose: requirements.businessGoals.primaryPurpose || [],
          homepageSections: requirements.businessGoals.homepageSections || [],
        },
        designPreferences: {
          brandPersonality: requirements.designPreferences.brandPersonality || '',
          brandGuidelines: {
            exists: requirements.designPreferences.brandGuidelines?.exists || false,
            description: requirements.designPreferences.brandGuidelines?.description || '',
          },
          colorPalette: requirements.designPreferences.colorPalette || '',
          stylePreference: requirements.designPreferences.stylePreference || '',
          fontPairing: requirements.designPreferences.fontPairing || '',
          userExperience: {
            accessibility: requirements.designPreferences.userExperience?.accessibility || 'standard',
            deviceSupport: requirements.designPreferences.userExperience?.deviceSupport || [],
            performanceExpectations: requirements.designPreferences.userExperience?.performanceExpectations || '',
            performance: requirements.designPreferences.userExperience?.performance || 'standard',
            responsive: requirements.designPreferences.userExperience?.responsive || 'unified',
          },
        },
      };

      console.log('Exact Submission Data:', exactRequirements);

      // Build the full payload with project context.
      const fullPayload = {
        project_id: projectId,
        submission_data: exactRequirements,
        project_context: {
          selectedPackage: {
            type: projectContext.selectedPackage.type,
            name: projectContext.selectedPackage.name,
            // Changed key from price_eur to priceEUR to match the schema
            priceEUR: projectContext.selectedPackage.priceEUR,
            features: projectContext.selectedPackage.features,
          },
          selectedAddons: projectContext.selectedAddons.map((addon) => ({
            id: addon.id,
            title: addon.title,
            // Changed key from price_eur to priceEUR to match the schema
            priceEUR: addon.priceEUR,
          })),
          totalPrice: projectContext.totalPrice,
        },
      };

      // Log exactly what is being sent.
      console.log('Full request payload:', JSON.stringify(fullPayload, null, 2));

      // Sending the payload.
      const response = await axios.post<PlannerSubmissionResponse>(
        `/api/planner/submissions/${projectId}/`,
        fullPayload
      );

      // Validate response
      if (!response.data?.planner?.client_summary || !response.data?.planner?.website_template) {
        throw new Error('Invalid response from planner API');
      }

      console.log('Success Response:', response.data);
      console.groupEnd();

      return response.data;
    } catch (error: any) {
      console.error('Planner submission error:', error);
      console.groupEnd();

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }

      const errorMessage =
        error.response?.data?.error || error.message || 'Failed to submit planner data';
      
      throw new Error(errorMessage);
    }
  },

  getSummary: async (projectId: number): Promise<PlannerSubmissionResponse> => {
    try {
      const response = await axios.get<PlannerSubmissionResponse>(
        `/api/planner/submissions/${projectId}/`
      );

      if (!response.data?.planner?.client_summary) {
        throw new Error('No summary data found');
      }

      return response.data;
    } catch (error: any) {
      console.error('Summary fetch error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch summary');
    }
  },
};
