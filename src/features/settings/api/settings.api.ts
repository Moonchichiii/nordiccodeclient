import apiClient from '@/lib/axios';
import { ProfileUpdateData, PasswordChangeData, SettingsResponse } from '../types/settings.types';

export const settingsApi = {
  updateProfile: async (data: Partial<ProfileUpdateData>): Promise<SettingsResponse> => {
    // Retrieve current user data to ensure all required fields are present
    const currentUserResponse = await apiClient.get('/api/users/me/');
    const currentUser = currentUserResponse.data.user;

    // Merge current user data with update data
    const updateData = {
      full_name: currentUser.full_name,
      phone_number: currentUser.phone_number,
      street_address: currentUser.street_address,
      city: currentUser.city,
      postal_code: currentUser.postal_code,
      country: currentUser.country,
      marketing_consent: currentUser.marketing_consent,
      ...data
    };

    const { data: response } = await apiClient.patch('/api/users/me/', updateData);
    return response;
  },

  changePassword: async (data: PasswordChangeData): Promise<SettingsResponse> => {
    const { data: response } = await apiClient.post('/api/users/password/change/', data);
    return response;
  },

  deleteAccount: async (): Promise<SettingsResponse> => {
    const { data: response } = await apiClient.delete('/api/users/me/delete/');
    return response;
  }
};