import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { InputField } from './InputField';
import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { useSettings } from '../hooks/useSettings';
import { profileSchema, ProfileData } from '../utils/validationSchemas';

interface ProfileSectionProps {
  isSubmitting?: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ isSubmitting }) => {
  const { user } = useAuthContext();
  const { updateProfile } = useSettings();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      phone_number: user?.phone_number || '',
      street_address: user?.street_address || '',
      city: user?.city || '',
      postal_code: user?.postal_code || '',
      country: user?.country || '',
      marketing_consent: user?.marketing_consent || false,
    }
  });

  const onSubmit = (data: ProfileData) => {
    updateProfile.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          icon={User}
          label="Full Name"
          placeholder="John Doe"
          {...register('full_name')}
          error={errors.full_name?.message}
        />
        <InputField
          icon={Mail}
          label="Email"
          value={user?.email}
          disabled
          className="opacity-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          icon={Phone}
          label="Phone Number"
          placeholder="+1234567890"
          {...register('phone_number')}
          error={errors.phone_number?.message}
        />
        <InputField
          icon={MapPin}
          label="Street Address"
          {...register('street_address')}
          error={errors.street_address?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          icon={MapPin}
          label="City"
          {...register('city')}
          error={errors.city?.message}
        />
        <InputField
          icon={MapPin}
          label="Postal Code"
          {...register('postal_code')}
          error={errors.postal_code?.message}
        />
        <InputField
          icon={MapPin}
          label="Country"
          {...register('country')}
          error={errors.country?.message}
        />
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          {...register('marketing_consent')}
          className="mt-1 rounded border-gray-700 bg-gray-800 text-yellow-500
          focus:ring-yellow-500/20 focus:ring-offset-0"
        />
        <label className="text-sm text-gray-400">
          I want to receive marketing communications
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || updateProfile.isLoading}
        className="flex items-center justify-center space-x-2 w-full md:w-auto
        px-6 py-2 bg-yellow-500 text-gray-900 rounded-xl font-medium
        hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50"
      >
        <Save className="h-5 w-5" />
        <span>Save Changes</span>
      </button>
    </form>
  );
};