import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import type { AuthUser } from '../types';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const hasAuthCookie = () => document.cookie.includes('access_token');

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ['auth-user'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: hasAuthCookie()
  });

  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth-user'], data.user);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      if (error.message.includes('verify your email')) {
        toast.error(error.message, {
          action: {
            label: 'Resend',
            onClick: () => {
              const email = queryClient.getQueryData(['last-login-attempt']);
              if (email) {
                authApi.resendVerificationEmail(email)
                  .then(() => toast.success('Verification email sent!'))
                  .catch(() => toast.error('Failed to send verification email'));
              }
            }
          }
        });
      } else {
        toast.error(error.message || 'Failed to login');
      }
    },
  });

  const register = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registration successful! Please check your email to verify your account.', {
        autoClose: 10000,
      });
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to register');
    },
  });

  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all query cache
      queryClient.clear();
      // Clear user data
      queryClient.setQueryData(['auth-user'], null);
      toast.success('Successfully logged out!');
      
      // Navigate to home page, retaining a clean state
      navigate('/', { 
        replace: true,
        state: { from: location.pathname } 
      });
    },
    onError: () => {
      // Even if logout fails on backend, clear local state
      queryClient.clear();
      queryClient.setQueryData(['auth-user'], null);
      navigate('/', { replace: true });
    }
  });

  return {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: Boolean(user),
  };
}