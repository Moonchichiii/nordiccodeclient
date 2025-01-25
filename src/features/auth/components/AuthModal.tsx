import React, { useState, ForwardedRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    X, Mail, Lock, User, Eye, EyeOff, 
    ChevronRight, ArrowLeft, Phone, MapPin, Globe, Building, Loader2 
} from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import type { AuthMode } from '../types/auth.types';
import GoogleSignInButton from '@/features/auth/components/GoogleSignInButton';
import { toast } from 'react-toastify';

// Form Schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

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
    accepted_terms: z.boolean().refine((val) => val, 'Terms must be accepted'),
    marketing_consent: z.boolean().optional().default(false),
    vat_number: z.string().max(50).optional(),
}).refine((data) => data.password1 === data.password2, {
    message: "Passwords don't match",
    path: ['password2'],
});

const resetSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type ResetForm = z.infer<typeof resetSchema>;

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ElementType;
    error?: string;
    label: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ icon: Icon, error, label, ...props }, ref: ForwardedRef<HTMLInputElement>) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="relative group">
                <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 
                               group-focus-within:text-yellow-500/70 transition-colors duration-300" />
                <input
                    ref={ref}
                    {...props}
                    className={`w-full bg-gray-800/50 text-white border rounded-lg py-2 pl-8 pr-2.5 
                    placeholder-gray-500 transition-all duration-300 text-sm
                    ${error ? 'border-red-500/50 focus:border-red-500' : 
                    'border-gray-700/50 focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/20'}`}
                />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    )
);

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type FormData = LoginForm | RegisterForm | ResetForm;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('login');
    const [showPassword, setShowPassword] = useState(false);
    const { login, register: registerUser, resetPassword } = useAuth();
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm<FormData>({
        resolver: zodResolver(
            mode === 'login' 
                ? loginSchema 
                : mode === 'register' 
                    ? registerSchema 
                    : resetSchema
        ),
    });

    const handleAuthSubmit = async (data: FormData) => {
        try {
            switch (mode) {
                case 'login':
                    await login.mutateAsync(data as LoginForm);
                    reset();
                    onSuccess?.();
                    onClose();
                    break;

                case 'register':
                    await registerUser.mutateAsync(data as RegisterForm);
                    setRegisteredEmail(data.email);
                    setShowVerification(true);
                    reset();
                    toast.success('Registration successful! Please check your email.');
                    break;

                case 'forgot-password':
                    await resetPassword.mutateAsync(data as ResetForm);
                    toast.success('Password reset link sent to your email');
                    reset();
                    onClose();
                    break;
            }
        } catch (error: any) {
            if (error.validation) {
                Object.entries(error.validation).forEach(([key, value]) => 
                    setError(key as keyof FormData, { message: value as string })
                );
            } else if (error.email?.includes('exists')) {
                setError('email', { message: 'Email already registered' });
            } else {
                toast.error(error.message || 'Authentication failed');
            }
        }
    };

    const handleModeChange = (newMode: AuthMode) => {
        setMode(newMode);
        reset();
    };

    const handleResendEmail = async (email: string) => {
        try {
            await authApi.resendVerificationEmail(email);
            toast.success('Verification email resent');
        } catch {
            toast.error('Failed to resend email');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="min-h-screen px-4 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
                
                <div className={`relative w-full transform overflow-hidden rounded-xl 
                    bg-gray-900 p-4 shadow-xl transition-all duration-500 ease-out
                    ${mode === 'register' ? 'max-w-3xl' : 'max-w-md'}`}
                    style={{
                        boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
                        transform: mode === 'register' ? 'translateX(0)' : 'none'
                    }}>
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-800/50 
                        transition-all duration-300"
                    >
                        <X className="h-4 w-4 text-gray-400" />
                    </button>

                    {mode === 'forgot-password' && (
                        <button
                            onClick={() => handleModeChange('login')}
                            className="absolute left-4 top-4 p-1 rounded-lg hover:bg-gray-800/50
                            transition-all duration-300 group"
                        >
                            <ArrowLeft className="h-4 w-4 text-gray-400" />
                        </button>
                    )}

                    <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
                            {mode === 'login' ? 'Welcome Back' : 
                             mode === 'register' ? 'Create Account' : 
                             'Reset Password'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400"> 
                            {mode === 'login' ? 'Sign in to continue to your account' :
                             mode === 'register' ? 'Fill in your details to create an account' :
                             'Enter your email to receive a reset link'}
                        </p>
                    </div>

                    {!showVerification ? (
                        <form onSubmit={handleSubmit(handleAuthSubmit)} className="space-y-3">
                            {mode === 'register' ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                                className="absolute right-2.5 top-[34px] text-gray-400 hover:text-yellow-500 
                                                transition-colors duration-300"
                                            >
                                                {showPassword ? 
                                                    <EyeOff className="h-4 w-4" /> : 
                                                    <Eye className="h-4 w-4" />
                                                }
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                                    <div className="grid grid-cols-2 gap-3">
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

                                    <div className="grid grid-cols-2 gap-3">
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

                                    <div className="space-y-2 mt-3">
                                        <label className="flex items-start space-x-2">
                                            <input
                                                type="checkbox"
                                                {...register('accepted_terms')}
                                                className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-yellow-500
                                                focus:ring-yellow-500/20 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-gray-400">
                                                I accept the terms and conditions
                                            </span>
                                        </label>
                                        {errors.accepted_terms && (
                                            <p className="text-red-500 text-xs">{errors.accepted_terms.message}</p>
                                        )}

                                        <label className="flex items-start space-x-2">
                                            <input
                                                type="checkbox"
                                                {...register('marketing_consent')}
                                                className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-800 text-yellow-500
                                                focus:ring-yellow-500/20 focus:ring-offset-0"
                                            />
                                            <span className="text-sm text-gray-400">
                                                I agree to receive marketing communications
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <InputField
                                        icon={Mail}
                                        label="Email Address"
                                        placeholder="you@example.com"
                                        type="email"
                                        {...register('email')}
                                        error={errors.email?.message}
                                    />

                                    {mode === 'login' && (
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
                                                {showPassword ? 
                                                    <EyeOff className="h-4 w-4" /> : 
                                                    <Eye className="h-4 w-4" />
                                                }
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 rounded-lg bg-yellow-500 text-gray-900 font-medium text-sm
                                hover:bg-yellow-400 transition-colors duration-300 mt-6 disabled:opacity-50
                                disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <span>
                                    {isSubmitting ? 'Processing...' :
                                    mode === 'login' ? 'Sign In' :
                                    mode === 'register' ? 'Create Account' :
                                    'Send Reset Link'}
                                </span>
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            {mode === 'login' && (
                                <>
                                    <div className="relative mt-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-700/50"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                                        </div>
                                    </div>
                                    
                                    <GoogleSignInButton onSuccess={onSuccess} onClose={onClose} />
                                </>
                            )}

                            <div className="text-center mt-4 space-y-2">
                                {mode === 'login' ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleModeChange('forgot-password')}
                                            className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-300"
                                        >
                                            Forgot your password?
                                        </button>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleModeChange('register')}
                                                className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-300"
                                            >
                                                Don't have an account? Sign up
                                            </button>
                                        </div>
                                    </>
                                ) : mode === 'register' ? (
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange('login')}
                                        className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-300"
                                    >
                                        Already have an account? Sign in
                                    </button>
                                ) : null}
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto" />
                            <h3 className="text-lg font-medium text-gray-200">Verify Your Email</h3>
                            <p className="text-sm text-gray-400">
                                We've sent a verification link to {registeredEmail}
                            </p>
                            <button
                                onClick={() => handleResendEmail(registeredEmail)}
                                className="w-full py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-yellow-500 transition-colors duration-300"
                            >
                                Resend Email
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;