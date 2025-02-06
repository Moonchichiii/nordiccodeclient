import { useMutation } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Requirements } from './types';

export const useSubmitPlanner = () => {
  return useMutation(async (data: { submission_data: Requirements }) => {
    const response = await axios.post('/api/planner/submit/', data);
    return response.data;
  });
};
