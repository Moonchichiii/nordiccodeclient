import axios from '@/lib/axios';

export interface PlannerSubmission {
  id: number;
  submission_data: any;
  client_summary: string;
  developer_worksheet: string;
  created_at: string;
}

export interface PlannerSubmissionInput {
  submission_data: any;
}

export const submitPlannerData = async (
  data: PlannerSubmissionInput
): Promise<PlannerSubmission> => {
  const response = await axios.post<PlannerSubmission>('/api/planner/submissions/', data);
  return response.data;
};
