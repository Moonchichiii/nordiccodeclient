import React, { useState, ForwardedRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
    X, Mail, Lock, User, Eye, EyeOff, 
    ChevronRight, ArrowLeft, Phone, MapPin, Globe, Building
} from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import type { AuthMode } from '../types/auth.types';

// Form Schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password2: z.string().min(8, 'Password must be at least 8 characters'),
    full_name: z.string().max(150).optional(),
    phone_number: z.string().max(30).optional(),
    street_address: z.string().max(255).optional(),
    city: z.string().max(100).optional(),
    state_or_region: z.string().max(100).optional(),
    postal_code: z.string().max(20).optional(),
    country: z.string().max(100).optional(),
    vat_number: z.string().max(50).optional(),
    accepted_terms: z.boolean().refine((val) => val, {
        message: 'You must accept the terms',
    }),
    marketing_consent: z.boolean().optional().default(false),
}).refine((data) => data.password === data.password2, {
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
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    ref={ref}
                    {...props}
                    className="w-full bg-gray-800/50 text-white border border-gray-700/50 rounded-lg py-2 pl-9 pr-3
                    placeholder-gray-500 focus:border-yellow-500/30 focus:ring-1 focus:ring-yellow-500/20
                    transition-all duration-300 text-sm"
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-0.5">{error}</p>}
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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(
            mode === 'login' 
                ? loginSchema 
                : mode === 'register' 
                    ? registerSchema 
                    : resetSchema
        ),
    });

    const handleAuthSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            switch (mode) {
                case 'login':
                    await login.mutateAsync(data as LoginForm);
                    break;
                case 'register':
                    await registerUser.mutateAsync(data as RegisterForm);
                    break;
                case 'forgot-password':
                    await resetPassword.mutateAsync(data as ResetForm);
                    break;
            }
            reset();
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Auth error:', error);
        }
    };

    const handleModeChange = (newMode: AuthMode) => {
        setMode(newMode);
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center px-4 py-8">
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
                
                <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-gray-900 p-6 text-left shadow-xl transition-all">
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

                    <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">
                            {mode === 'login' ? 'Welcome Back' : 
                             mode === 'register' ? 'Create Account' : 
                             'Reset Password'}
                        </h3>
                        <p className="mt-1.5 text-sm text-gray-400">
                            {mode === 'login' ? 'Sign in to continue to your account' :
                             mode === 'register' ? 'Fill in your details to create an account' :
                             'Enter your email to receive a reset link'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleAuthSubmit)} className="space-y-4">
                        {mode === 'register' ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        icon={User}
                                        label="Full Name"
                                        placeholder="John Doe"
                                        {...register('full_name')}
                                        error={errors.full_name?.message}
                                    />
                                    <InputField
                                        icon={Phone}
                                        label="Phone Number"
                                        placeholder="+1234567890"
                                        {...register('phone_number')}
                                        error={errors.phone_number?.message}
                                    />
                                </div>

                                <InputField
                                    icon={Mail}
                                    label="Email Address"
                                    placeholder="you@example.com"
                                    type="email"
                                    {...register('email')}
                                    error={errors.email?.message}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <InputField
                                        icon={Lock}
                                        label="Confirm Password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password2')}
                                        error={errors.password2?.message}
                                    />
                                </div>

                                <div className="space-y-4 mt-6">
                                    <h4 className="text-sm font-medium text-gray-300">Additional Information</h4>
                                    <InputField
                                        icon={MapPin}
                                        label="Street Address"
                                        placeholder="Your Address"
                                        {...register('street_address')}
                                        error={errors.street_address?.message}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <InputField
                                            icon={Building}
                                            label="City"
                                            placeholder="Your City"
                                            {...register('city')}
                                            error={errors.city?.message}
                                        />
                                        <InputField
                                            icon={MapPin}
                                            label="State/Region"
                                            placeholder="Your State"
                                            {...register('state_or_region')}
                                            error={errors.state_or_region?.message}
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
                                            icon={Globe}
                                            label="Country"
                                            placeholder="Your Country"
                                            {...register('country')}
                                            error={errors.country?.message}
                                        />
                                    </div>

                                    <InputField
                                        icon={Building}
                                        label="VAT Number"
                                        placeholder="VAT123456"
                                        {...register('vat_number')}
                                        error={errors.vat_number?.message}
                                    />
                                </div>

                                <div className="space-y-3 mt-6">
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
                            <button 
                                type="button"
                                className="w-full flex items-center justify-center space-x-2 p-2 mt-4 rounded-lg
                                bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 transition-all duration-300"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                                    <path
                                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                        fill="#4285F4"
                                    />
                                </svg>
                                <span className="text-sm text-gray-300">Continue with Google</span>
                            </button>
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
                </div>
            </div>
        </div>
    );
};

export default AuthModal;