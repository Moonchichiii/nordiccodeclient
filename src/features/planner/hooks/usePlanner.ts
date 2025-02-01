import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitPlannerData, PlannerSubmissionInput, PlannerSubmission } from './plannerApi';

export const useSubmitPlanner = () => {
  const queryClient = useQueryClient();
  return useMutation<PlannerSubmission, Error, PlannerSubmissionInput>({
    mutationFn: submitPlannerData,
    onSuccess: () => {
      // Invalidate any related queries if necessary.
      queryClient.invalidateQueries(['planner-submissions']);
    },
  });
};
