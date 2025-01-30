import { useState, useEffect } from 'react';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import type { AuthMode } from '@/features/auth/types/auth.types';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import { ForgotPasswordForm } from '../forms/ForgotPasswordForm';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { authApi } from '@/features/auth/api/auth.api';
import { toast } from 'react-toastify';

interface AuthModalProps {
    isOpen: boolean;
    initialMode: 'login' | 'register';
    onClose: () => void;
    onSuccess?: () => void;
}

interface VerificationStateProps {
    email: string;
    onResendEmail: (email: string) => Promise<void>;
}

const VerificationState: React.FC<VerificationStateProps> = ({ email, onResendEmail }) => (
    <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto" />
        <h3 className="text-lg font-medium text-gray-200">Verify Your Email</h3>
        <p className="text-sm text-gray-400">
            We've sent a verification link to {email}
        </p>
        <button
            onClick={() => onResendEmail(email)}
            className="w-full py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-yellow-500 
                     transition-colors duration-300"
        >
            Resend Email
        </button>
    </div>
);

export const AuthModal: React.FC<AuthModalProps> = ({ 
    isOpen, 
    initialMode, 
    onClose, 
    onSuccess 
}) => {
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const handleModeChange = (newMode: AuthMode) => {
        setMode(newMode);
    };

    const handleRegistrationComplete = (email: string) => {
        setRegisteredEmail(email);
        setShowVerification(true);
        localStorage.setItem('pendingVerificationEmail', email);
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

                <div
                    className={`relative w-full transform overflow-hidden rounded-xl 
                        bg-gray-900 p-4 shadow-xl transition-all duration-500 ease-out
                        ${mode === 'register' ? 'max-w-3xl' : 'max-w-md'}`}
                    style={{
                        boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
                        transform: mode === 'register' ? 'translateX(0)' : 'none'
                    }}
                >
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
                            {mode === 'login'
                                ? 'Welcome Back'
                                : mode === 'register'
                                ? 'Create Account'
                                : 'Reset Password'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            {mode === 'login'
                                ? 'Sign in to continue to your account'
                                : mode === 'register'
                                ? 'Fill in your details to create an account'
                                : 'Enter your email to receive a reset link'}
                        </p>
                    </div>

                    {!showVerification ? (
                        <>
                            {mode === 'login' && (
                                <>
                                    <LoginForm
                                        onSuccess={onSuccess}
                                        onClose={onClose}
                                        onModeChange={handleModeChange}
                                    />
                                    <div className="relative mt-6">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-700/50"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm mb-4">
                                            <span className="px-2 bg-gray-900 text-gray-400">
                                                Or continue with
                                            </span>
                                        </div>
                                    </div>
                                    <GoogleSignInButton onSuccess={onSuccess} onClose={onClose} />
                                </>
                            )}
                            {mode === 'register' && (
                                <RegisterForm
                                    onModeChange={handleModeChange}
                                    onRegistrationComplete={handleRegistrationComplete}
                                />
                            )}
                            {mode === 'forgot-password' && (
                                <ForgotPasswordForm
                                    onClose={onClose}
                                    onModeChange={handleModeChange}
                                />
                            )}
                        </>
                    ) : (
                        <VerificationState
                            email={registeredEmail}
                            onResendEmail={handleResendEmail}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;