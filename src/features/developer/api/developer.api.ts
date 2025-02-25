import axios from '@/lib/axios';
import { DeveloperWorksheet } from '../types/developer.types';

export const developerApi = {
  // Fetch developer worksheet for a project
  getWorksheet: async (projectId: number): Promise<DeveloperWorksheet> => {
    try {
      const response = await axios.get<DeveloperWorksheet>(
        `/api/developer/worksheets/${projectId}/`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching developer worksheet:', error);
      throw error;
    }
  },

  // Update worksheet notes
  updateNotes: async (projectId: number, notes: string): Promise<void> => {
    await axios.patch(`/api/developer/worksheets/${projectId}/`, { notes });
  }
};