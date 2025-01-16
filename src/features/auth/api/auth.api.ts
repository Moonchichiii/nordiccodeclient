import apiClient from '@/lib/axios'
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/token/', credentials)
      return data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to login')
    }
  },
  
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>('/auth/registration/', credentials)
      return data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to register')
    }
  },
  
  logout: async () => {
    try {
      await apiClient.post('/auth/logout/')
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to logout')
    }
  },
  
  getCurrentUser: async () => {
    try {
      const { data } = await apiClient.get('/auth/user/')
      return data
    } catch (error: any) {
      // Don't throw on 401/403 as it's expected when not authenticated
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        throw new Error(error.response?.data?.detail || 'Failed to get user')
      }
      return null
    }
  },

  verifyAuth: async () => {
    try {
      const { data } = await apiClient.get('/auth/verify/')
      return data
    } catch (error: any) {
      // Don't throw on 401/403
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        throw new Error(error.response?.data?.detail || 'Failed to verify auth')
      }
      return { isValid: false }
    }
  },

  resetPassword: async (email: string) => {
    try {
      const { data } = await apiClient.post('/auth/password/reset/', { email })
      return data
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to reset password')
    }
  }
}