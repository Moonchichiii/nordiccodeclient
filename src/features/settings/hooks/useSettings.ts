import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi} from '@/features/settings/api/settings.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ProfileData, PasswordData } from '@/features/settings/utils/validationSchemas';


export function useSettings() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const updateProfile = useMutation<void, Error, ProfileData>({
    mutationFn: settingsApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['auth-user']);
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  const changePassword = useMutation<void, Error, PasswordData>({
    mutationFn: settingsApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to change password');
    }
  });

  const deleteAccount = useMutation<void, Error>({
    mutationFn: settingsApi.deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Account deleted successfully');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete account');
    }
  });

  return {
    updateProfile,
    changePassword,
    deleteAccount
  };
}