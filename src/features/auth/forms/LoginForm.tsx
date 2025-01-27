import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { InputField } from '../shared/InputField';
import { toast } from 'react-toastify';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSuccess?: () => void;
    onClose: () => void;
    onModeChange: (mode: 'register' | 'forgot-password') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
    onSuccess, 
    onClose,
    onModeChange 
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const handleLogin = async (data: LoginForm) => {
        try {
            await login.mutateAsync(data);
            reset();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            if (error.validation) {
                Object.entries(error.validation).forEach(([key, value]) =>
                    setError(key as keyof LoginForm, { message: value as string })
                );
            } else {
                toast.error(error.message || 'Login failed');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-3">
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
                    className="absolute right-3 top-[38px] text-gray-400 hover:text-yellow-500 
                             transition-colors duration-300"
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 rounded-lg bg-yellow-500 text-gray-900 font-medium text-sm
                         hover:bg-yellow-400 transition-colors duration-300 mt-6 disabled:opacity-50
                         disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                <span>{isSubmitting ? 'Processing...' : 'Sign In'}</span>
                <ChevronRight className="w-4 h-4" />
            </button>

            <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
            </div>

            <div className="text-center mt-4 space-y-2">
                <button
                    type="button"
                    onClick={() => onModeChange('forgot-password')}
                    className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-300"
                >
                    Forgot your password?
                </button>
                <div>
                    <button
                        type="button"
                        onClick={() => onModeChange('register')}
                        className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-300"
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
        </form>
    );
};

export default LoginForm;