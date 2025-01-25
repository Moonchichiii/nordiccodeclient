import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { authApi } from '../api/auth.api';

const EmailConfirmationModal = () => {
  const [countdown, setCountdown] = useState(60);
  const [status, setStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const [canResend, setCanResend] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const startCountdown = useCallback(() => {
    setCountdown(60);
    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const cleanup = startCountdown();
    return () => cleanup();
  }, [startCountdown]);

  const handleResendEmail = async () => {
    try {
      // Get email from local storage or state management
      const email = localStorage.getItem('pendingVerificationEmail');
      if (!email) return;

      await authApi.resendVerificationEmail(email);
      startCountdown();
      toast.success('Verification email resent!');
    } catch (error) {
      toast.error('Failed to resend verification email');
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-800">
        <div className="text-center space-y-4">
          {status === 'pending' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto" />
              <h3 className="text-lg font-medium text-gray-200">
                Verify Your Email
              </h3>
              <p className="text-sm text-gray-400">
                We've sent you a verification email. Please check your inbox and click the verification link.
              </p>
              <div className="mt-4 space-y-3">
                <p className="text-sm text-gray-500">
                  Can't find the email? Check your spam folder or wait {countdown} seconds to resend
                </p>
                <button
                  onClick={handleResendEmail}
                  disabled={!canResend}
                  className="flex items-center justify-center space-x-2 w-full py-2 px-4 
                           bg-gray-800 rounded-lg text-sm font-medium text-gray-300
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-700 transition-colors duration-200"
                >
                  <RefreshCw className={`h-4 w-4 ${!canResend && 'animate-spin'}`} />
                  <span>Resend Email</span>
                </button>
              </div>
            </>
          )}

          {status === 'verified' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-medium text-gray-200">
                Email Verified!
              </h3>
              <p className="text-sm text-gray-400">
                Your email has been verified successfully. Redirecting to dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-medium text-gray-200">
                Verification Failed
              </h3>
              <p className="text-sm text-gray-400">
                We couldn't verify your email. Please try again or contact support.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 w-full py-2 px-4 bg-yellow-500 text-gray-900 rounded-lg
                         hover:bg-yellow-400 transition-colors duration-200"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationModal;