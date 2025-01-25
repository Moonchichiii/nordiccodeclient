import apiClient from '@/lib/axios';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/api/auth/login/', credentials);
      return data;
    } catch (error: any) {
      const errors = error.response?.data;
      throw {
        email: errors?.email?.[0],
        password: errors?.password?.[0], 
        verification: errors?.non_field_errors?.[0]?.includes('verify') 
          ? 'Please verify your email first'
          : null,
        general: errors?.detail || 'Login failed'
      };
    }
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/api/auth/registration/', credentials);
      return data;
    } catch (error: any) {
      const errors = error.response?.data;
      throw {
        email: errors?.email?.[0],
        password1: errors?.password1?.[0],
        password2: errors?.password2?.[0],
        full_name: errors?.full_name?.[0],
        phone_number: errors?.phone_number?.[0],
        address: errors?.address?.[0],
        accepted_terms: errors?.accepted_terms?.[0],
        general: errors?.detail || 'Registration failed',
        validation: errors?.non_field_errors?.[0]
      };
    }
  },

  verifyEmail: async (key: string): Promise<void> => {
    try {
      await apiClient.get(`/api/users/verify-email/${key}/`);
    } catch (error: any) {
      throw {
        verification: error.response?.data?.detail || 'Email verification failed',
        expired: error.response?.data?.code === 'expired'
      };
    }
  },

  resendVerificationEmail: async (email: string): Promise<void> => {
    try {
      await apiClient.post('/api/auth/registration/resend-email/', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to resend verification email');
    }
  }
};