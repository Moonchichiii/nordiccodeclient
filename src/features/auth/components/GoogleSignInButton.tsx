import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from 'react-toastify';

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    onClose?: () => void;
}

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, onClose }) => {
    const { login } = useAuth();
    const buttonRef = useRef<HTMLDivElement>(null);
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    useEffect(() => {
        // Load the Google Identity Services script
        const loadGoogleScript = () => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);

            return new Promise<void>((resolve) => {
                script.onload = () => resolve();
            });
        };

        const initializeGoogleSignIn = async () => {
            await loadGoogleScript();

            if (!window.google) return;

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    if (response.credential) {
                        try {
                            await login.mutateAsync({
                                token: response.credential,
                                provider: 'google'
                            });
                            onSuccess?.();
                            onClose?.();
                        } catch (error) {
                            console.error('Google sign-in error:', error);
                            toast.error('Failed to sign in with Google');
                        }
                    }
                },
                ux_mode: 'popup',
            });

            if (buttonRef.current) {
                window.google.accounts.id.renderButton(buttonRef.current, {
                    type: 'standard',
                    theme: isDarkMode ? 'filled_black' : 'outline',
                    size: 'large',
                    text: 'continue_with',
                    shape: 'pill',
                    logo_alignment: 'left',
                    width: buttonRef.current.offsetWidth,
                });
            }
        };

        initializeGoogleSignIn();

        // Cleanup
        return () => {
            const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
            if (scriptElement && scriptElement.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement);
            }
        };
    }, [login, onSuccess, onClose]);

    // Listen for dark mode changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (buttonRef.current && window.google?.accounts?.id) {
                window.google.accounts.id.renderButton(buttonRef.current, {
                    type: 'standard',
                    theme: mediaQuery.matches ? 'filled_black' : 'outline',
                    size: 'large',
                    text: 'continue_with',
                    shape: 'pill',
                    logo_alignment: 'left',
                    width: buttonRef.current.offsetWidth,
                });
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <div className="w-full">
            <div 
                ref={buttonRef}
                className="w-full min-h-[40px] flex items-center justify-center"
                aria-label="Sign in with Google"
            />
        </div>
    );
};

export default GoogleSignInButton;