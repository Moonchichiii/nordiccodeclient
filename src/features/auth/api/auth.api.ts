import apiClient from '@/lib/axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/api/auth/login/', credentials);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to login');
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/api/auth/registration/', credentials);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to register');
    }
  },

  logout: async () => {
    await apiClient.post('/api/auth/logout/');
  },

  verifyEmail: async (key: string): Promise<void> => {
    await apiClient.get(`/api/users/verify-email/${key}/`);
  },

  getCurrentUser: async () => {
    try {
      const { data } = await apiClient.get('/api/users/me/');
      return data.user;
    } catch {
      return null;
    }
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    await apiClient.post('/api/auth/registration/resend-email/', { email });
  }  
};