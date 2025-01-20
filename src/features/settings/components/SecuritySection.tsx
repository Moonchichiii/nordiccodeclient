// components/SecuritySection.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Trash2, AlertCircle, Save } from 'lucide-react';
import { InputField } from './InputField';
import { useSettings } from '../hooks/useSettings';
import { passwordSchema, PasswordData } from '../utils/validationSchemas';

export const SecuritySection: React.FC = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { changePassword, deleteAccount } = useSettings();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = (data: PasswordData) => {
    // Omit confirm_password for API call
    const { confirm_password, ...apiData } = data;
    changePassword.mutate(apiData);
    reset(); // Clear form after submission
  };

  const handleDeleteAccount = () => {
    deleteAccount.mutate();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        
        <div className="space-y-4">
          <InputField
            icon={Lock}
            label="Current Password"
            type="password"
            {...register('old_password')}
            error={errors.old_password?.message}
          />
          <InputField
            icon={Lock}
            label="New Password"
            type="password"
            {...register('new_password')}
            error={errors.new_password?.message}
          />
          <InputField
            icon={Lock}
            label="Confirm New Password"
            type="password"
            {...register('confirm_password')}
            error={errors.confirm_password?.message}
          />
        </div>

        <button
          type="submit"
          disabled={changePassword.isLoading}
          className="flex items-center justify-center space-x-2 w-full md:w-auto
          px-6 py-2 bg-yellow-500 text-gray-900 rounded-xl font-medium
          hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          <span>Update Password</span>
        </button>
      </form>

      <div className="border-t border-gray-700/50 pt-8">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Danger Zone</h2>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center space-x-2 w-full md:w-auto
            px-6 py-2 bg-red-500/10 text-red-500 rounded-xl font-medium
            hover:bg-red-500/20 transition-colors duration-200"
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete Account</span>
          </button>
        ) : (
          <div className="bg-red-500/10 rounded-xl p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-500">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccount.isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg
                hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg
                hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};