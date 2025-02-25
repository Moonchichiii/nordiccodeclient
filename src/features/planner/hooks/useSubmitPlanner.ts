import { useMutation } from '@tanstack/react-query';
import { Requirements } from '@/features/planner/types/types';
import { PackageData, Addon } from '@/features/projects/types/types';
import { plannerApi } from '../api/planner.api';
import { toast } from 'react-toastify';

export interface PlannerSubmissionParams {
  projectId: number;
  requirements: Requirements;
  projectContext: {
    selectedPackage: PackageData;
    selectedAddons: Addon[];
    totalPrice: number;
  };
}

export interface PlannerResponse {
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

export const usePlannerSubmission = () => {
  return useMutation<
    PlannerResponse, 
    Error, 
    PlannerSubmissionParams
  >({
    mutationFn: async ({ projectId, requirements, projectContext }) => {
      try {
        // Validate inputs
        if (!projectId) {
          throw new Error('Project ID is required');
        }

        // Combine project context with submission data
        return await plannerApi.submitPlannerData(
          projectId, 
          requirements, 
          projectContext
        );
      } catch (error: any) {
        const errorMessage = error.response?.data?.error 
          || error.message 
          || 'Failed to submit planner data';
        
        toast.error(errorMessage);
        throw error;
      }
    },
    onError: (error) => {
      console.error('Planner submission error:', error);
    }
  });
};