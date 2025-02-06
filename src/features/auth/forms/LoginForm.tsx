import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { InputField } from '@/features/auth/components/shared/InputField';
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onClose: () => void;
  onModeChange: (mode: 'register' | 'forgot-password') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onClose, onModeChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      await login.mutateAsync(data);
      reset();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      if (error.validation) {
        Object.entries(error.validation).forEach(([key, value]) =>
          setError(key as keyof LoginFormValues, { message: value as string })
        );
      } else {
        toast.error(error.message || 'Login failed');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
      <InputField
        icon={Mail}
        label="Email Address"
        placeholder="you@example.com"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="relative">
        <InputField
          icon={Lock}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-full bg-primary text-white font-medium text-sm 
          hover:bg-primary-light transition-colors duration-300 mt-6 disabled:opacity-50 
          disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span>{isSubmitting ? 'Processing...' : 'Sign In'}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>

      <div className="text-center mt-6 space-y-3">
        <button
          type="button"
          onClick={() => onModeChange('forgot-password')}
          className="text-sm text-foreground-alt hover:text-primary transition-colors duration-300"
        >
          Forgot your password?
        </button>
        <div>
          <button
            type="button"
            onClick={() => onModeChange('register')}
            className="text-sm text-foreground-alt hover:text-primary transition-colors duration-300"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </form>
  );
};

export { LoginForm };