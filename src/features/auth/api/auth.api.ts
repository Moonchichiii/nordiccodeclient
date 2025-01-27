import apiClient from '@/lib/axios';
import type {
  AuthResponse,
  RegisterResponse,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/api/auth/login/', credentials);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to login');
    }
  },

  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    try {
      const { data } = await apiClient.post<RegisterResponse>(
        '/api/auth/registration/',
        credentials
      );
      return data;
    } catch (error: any) {
      const errData = error.response?.data;
      const detail =
        errData?.detail ||
        errData?.non_field_errors?.[0] ||
        JSON.stringify(errData) ||
        'Registration failed';
      throw new Error(detail);
    }
  },

  logout: async () => {
    await apiClient.post('/api/auth/logout/');
  },

  verifyEmail: async (key: string) => {
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

  resendVerificationEmail: async (email: string) => {
    await apiClient.post('/api/auth/registration/resend-email/', { email });
  },
};
