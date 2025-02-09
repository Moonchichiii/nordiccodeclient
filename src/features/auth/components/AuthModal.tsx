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
  <div className="text-center space-y-6 px-4">
    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
    <div>
      <h3 className="text-xl font-light text-foreground mb-2">Verify Your Email</h3>
      <p className="text-foreground-alt">
        We've sent a verification link to <span className="text-foreground">{email}</span>
      </p>
    </div>
    <button
      onClick={() => onResendEmail(email)}
      className="w-full py-3 rounded-full bg-background-alt text-foreground-alt hover:text-primary
        transition-colors duration-300 border border-primary/10 hover:border-primary/30"
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto">
      <div className="min-h-screen w-full px-4 py-20 flex items-center justify-center">
        <div 
          className="fixed inset-0 bg-background/95 backdrop-blur-md" 
          onClick={onClose} 
        />

        <div
          className={`relative w-full transform overflow-hidden rounded-3xl
            bg-background border border-primary/10 shadow-2xl shadow-primary/5 
            transition-all duration-500 ease-out
            ${mode === 'register' ? 'max-w-4xl' : 'max-w-lg'}`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 p-4 rounded-full bg-background hover:bg-primary/5 
              text-foreground-alt hover:text-foreground transition-colors focus:outline-none 
              focus-visible:ring-2 focus-visible:ring-primary/50 z-[60] border border-primary/10
              shadow-lg hover:shadow-xl"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Back Button for Forgot Password */}
          {mode === 'forgot-password' && (
            <button
              onClick={() => handleModeChange('login')}
              className="absolute left-6 top-6 p-2 rounded-full hover:bg-primary/5
                transition-colors duration-300 group"
            >
              <ArrowLeft className="h-5 w-5 text-foreground-alt group-hover:text-foreground" />
            </button>
          )}

          <div className="p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-light">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                  {mode === 'login'
                    ? 'Welcome Back'
                    : mode === 'register'
                    ? 'Create Account'
                    : 'Reset Password'}
                </span>
              </h3>
              <p className="mt-2 text-foreground-alt">
                {mode === 'login'
                  ? 'Sign in to continue to your account'
                  : mode === 'register'
                  ? 'Fill in your details to create an account'
                  : 'Enter your email to receive a reset link'}
              </p>
            </div>

            {/* Form Content */}
            <div className={mode === 'register' ? 'px-4' : ''}>
              {!showVerification ? (
                <>
                  {mode === 'login' && (
                    <>
                      <LoginForm
                        onSuccess={onSuccess}
                        onClose={onClose}
                        onModeChange={handleModeChange}
                      />
                      <div className="relative mt-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-primary/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-background text-foreground-alt">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <GoogleSignInButton onSuccess={onSuccess} onClose={onClose} />
                      </div>
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
      </div>
    </div>
  );
};

export default AuthModal;