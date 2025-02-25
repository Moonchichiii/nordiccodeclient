// src/features/summary/hooks/useSummary.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSummary } from '@/features/summary/api/summary.api';
import { SummaryAPIResponse } from '@/features/summary/types/summary.types';
import { toast } from 'react-toastify';

interface UseSummaryOptions {
  onSuccess?: (data: SummaryAPIResponse) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

// Global variable for debouncing toast errors
let lastToastTime = 0;

export const useSummary = (projectId: number, options: UseSummaryOptions = {}) => {
  const queryClient = useQueryClient();

  return useQuery<SummaryAPIResponse, Error>({
    queryKey: ['summary', projectId],
    queryFn: async () => {
      // Check cache first
      const cachedData = queryClient.getQueryData<SummaryAPIResponse>(['summary', projectId]);
      if (
        cachedData?.planner?.website_template &&
        typeof cachedData.planner.website_template === 'object'
      ) {
        return cachedData;
      }

      const data = await getSummary(projectId);

      // Ensure planner exists and website_template is a valid non-empty object
      if (!data?.planner) {
        throw new Error('Invalid response: missing planner data');
      }
      if (
        !data.planner.website_template ||
        typeof data.planner.website_template !== 'object' ||
        Object.keys(data.planner.website_template).length === 0 ||
        !data.planner.client_summary
      ) {
        throw new Error('Invalid response structure from planner API');
      }

      // Pre-warm cache for each section if available
      if (data.planner.website_template.sections) {
        Object.entries(data.planner.website_template.sections).forEach(
          ([sectionId, content]) => {
            queryClient.setQueryData(['summary', projectId, 'section', sectionId], content);
          }
        );
      }

      return data;
    },
    enabled: options.enabled ?? !!projectId,
    refetchInterval: (data) => {
      // If we have a valid non-empty website_template, stop polling
      if (
        data &&
        data.planner &&
        data.planner.website_template &&
        typeof data.planner.website_template === 'object' &&
        Object.keys(data.planner.website_template).length > 0
      ) {
        return false;
      }
      return 10000; // Poll every 10 seconds otherwise
    },
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      if (error.message.includes('Invalid response')) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    staleTime: 30000,
    cacheTime: 1000 * 60 * 5,
    onSuccess: (data) => {
      options.onSuccess?.(data);
      // Pre-warm each section’s cache
      if (data?.planner?.website_template?.sections) {
        Object.keys(data.planner.website_template.sections).forEach((sectionId) => {
          queryClient.prefetchQuery({
            queryKey: ['summary', projectId, 'section', sectionId],
            queryFn: () =>
              data.planner.website_template.sections[sectionId],
            staleTime: 30000,
          });
        });
      }
    },
    onError: (error) => {
      options.onError?.(error);
      // Debounce error toast: only show once every 30 seconds
      if (Date.now() - lastToastTime > 30000) {
        if (error.message.includes('timeout')) {
          toast.error('Preview generation is taking longer than expected. Retrying...');
        } else if (error.message.includes('Invalid response')) {
          toast.error('Error generating preview. Please try again.');
        } else {
          toast.error(error.message);
        }
        lastToastTime = Date.now();
      }
      console.error('Summary fetch error:', error);
    },
  });
};

// --- Export additional hooks as needed ---

export const useSectionData = (projectId: number, sectionId: string) => {
  return useQuery({
    queryKey: ['summary', projectId, 'section', sectionId],
    queryFn: async () => {
      const data = await getSummary(projectId);
      if (
        !data ||
        !data.planner ||
        !data.planner.website_template ||
        typeof data.planner.website_template !== 'object'
      ) {
        throw new Error('Website template not available');
      }
      const sectionContent = data.planner.website_template.sections?.[sectionId];
      if (!sectionContent) {
        throw new Error(`Section ${sectionId} not available`);
      }
      return sectionContent;
    },
    enabled: !!projectId && !!sectionId,
    staleTime: 30000,
  });
};

export const useTemplateData = (projectId: number) => {
  return useQuery<SummaryAPIResponse['planner']['website_template'], Error>({
    queryKey: ['summary', projectId, 'template'],
    queryFn: async () => {
      const data = await getSummary(projectId);
      if (!data?.planner?.website_template) {
        throw new Error('Website template not available');
      }
      return data.planner.website_template;
    },
    enabled: !!projectId,
    staleTime: 30000,
  });
};

export const useClientSummary = (projectId: number) => {
  return useQuery<string, Error>({
    queryKey: ['summary', projectId, 'clientSummary'],
    queryFn: async () => {
      const data = await getSummary(projectId);
      if (!data?.planner?.client_summary) {
        throw new Error('Client summary not available');
      }
      return data.planner.client_summary;
    },
    enabled: !!projectId,
    staleTime: 30000,
  });
};
