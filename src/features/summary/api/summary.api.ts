import axios from '@/lib/axios';
import { SummaryData } from '../types/summary.types';

export const getSummary = async (projectId: number): Promise<SummaryData> => {
  try {
    const response = await axios.get<SummaryData>(`/api/planner/submissions/${projectId}/`);
    
    // Validate response structure
    if (!response.data?.client_summary || !response.data?.website_template) {
      throw new Error('Invalid response structure from planner API');
    }        
    
    return response.data;
  } catch (error) {
    console.error('Error fetching planner summary:', error);
    throw error;
  }
};