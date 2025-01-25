import { useMutation, useQuery } from '@tanstack/react-query';
import { projectApi } from '../api/project.api';
import { queryClient } from '@/lib/react-query';

export const usePlanner = (projectId: string) => {
  const {
    data: plan,
    isLoading,
    error
  } = useQuery({
    queryKey: ['project-plan', projectId],
    queryFn: () => projectApi.getPlan(projectId)
  });

  const submitStep = useMutation({
    mutationFn: ({ stepId, data }: { stepId: string; data: any }) =>
      projectApi.submitPlanningStep(projectId, stepId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project-plan', projectId]);
    }
  });

  const completePlanning = useMutation({
    mutationFn: () => projectApi.completePlanning(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries(['project-plan', projectId]);
    }
  });

  return {
    plan,
    isLoading,
    error,
    submitStep,
    completePlanning
  };
};