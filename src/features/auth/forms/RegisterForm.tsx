import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import {
  Mail, Lock, User, Eye, EyeOff,
  ArrowRight, Phone, MapPin, Globe, Building
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { InputField } from '../components/shared/InputField';
import { toast } from 'react-toastify';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password1: z.string().min(8, 'Password must be at least 8 characters'),
  password2: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  phone_number: z.string().regex(/^\+?1?\d{9,15}$/, 'Invalid phone number format'),
  street_address: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  accepted_terms: z.boolean().refine(val => val, 'Terms must be accepted'),
  marketing_consent: z.boolean().optional().default(false),
  vat_number: z.string().max(50).optional(),
}).refine(data => data.password1 === data.password2, {
  message: "Passwords don't match",
  path: ['password2'],
});

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onModeChange: (mode: 'login') => void;
  onRegistrationComplete: (email: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onModeChange,
  onRegistrationComplete
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const response = await registerUser.mutateAsync(data);
      if (response) {
        onRegistrationComplete(data.email);
        reset();
      }
    } catch (error: any) {
      if (error.response?.data?.validation) {
        Object.entries(error.response.data.validation).forEach(([key, value]) =>
          setError(key as keyof RegisterForm, { message: value as string })
        );
      } else if (error.response?.data?.email?.includes('exists')) {
        setError('email', { message: 'Email already registered' });
      } else {
        toast.error(error.message || 'Registration failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-primary">Personal Information</h4>
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
            label="Email Address"
            placeholder="you@example.com"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <InputField
              icon={Lock}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password1')}
              error={errors.password1?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-foreground-alt hover:text-primary 
                transition-colors duration-300 p-1 rounded-full hover:bg-primary/5"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <InputField
            icon={Lock}
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            {...register('password2')}
            error={errors.password2?.message}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-primary">Contact Information</h4>
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
            placeholder="Your Address"
            {...register('street_address')}
            error={errors.street_address?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            icon={Building}
            label="City"
            placeholder="Your City"
            {...register('city')}
            error={errors.city?.message}
          />
          <InputField
            icon={Globe}
            label="Country"
            placeholder="Your Country"
            {...register('country')}
            error={errors.country?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            icon={MapPin}
            label="Postal Code"
            placeholder="12345"
            {...register('postal_code')}
            error={errors.postal_code?.message}
          />
          <InputField
            icon={Building}
            label="VAT Number (Optional)"
            placeholder="VAT123456"
            {...register('vat_number')}
            error={errors.vat_number?.message}
          />
        </div>
      </div>

      {/* Terms and Consent */}
      <div className="space-y-3 bg-background-alt/50 p-4 rounded-2xl border border-primary/10">
        <label className="flex items-start gap-3 group cursor-pointer">
          <input
            type="checkbox"
            {...register('accepted_terms')}
            className="mt-1 w-4 h-4 rounded-md border-primary/20 bg-background text-primary
              focus:ring-primary/20 focus:ring-offset-0 group-hover:border-primary/40"
          />
          <span className="text-sm text-foreground-alt group-hover:text-foreground transition-colors">
            I accept the terms and conditions
          </span>
        </label>
        {errors.accepted_terms && (
          <p className="text-destructive text-sm pl-7">{errors.accepted_terms.message}</p>
        )}

        <label className="flex items-start gap-3 group cursor-pointer">
          <input
            type="checkbox"
            {...register('marketing_consent')}
            className="mt-1 w-4 h-4 rounded-md border-primary/20 bg-background text-primary
              focus:ring-primary/20 focus:ring-offset-0 group-hover:border-primary/40"
          />
          <span className="text-sm text-foreground-alt group-hover:text-foreground transition-colors">
            I agree to receive marketing communications
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-full bg-primary text-white font-medium text-sm
          hover:bg-primary-light transition-colors duration-300 disabled:opacity-50
          disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>{isSubmitting ? 'Processing...' : 'Create Account'}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => onModeChange('login')}
          className="text-sm text-foreground-alt hover:text-primary transition-colors duration-300"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;