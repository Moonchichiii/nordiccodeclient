import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Mail, ChevronRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { InputField } from '@/features/auth/components/shared/InputField';
import { toast } from 'react-toastify';

const resetSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ResetForm = z.infer<typeof resetSchema>;

interface ForgotPasswordFormProps {
    onClose: () => void;
    onModeChange: (mode: 'login') => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    onClose,
    onModeChange
}) => {
    const { resetPassword } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm<ResetForm>({
        resolver: zodResolver(resetSchema),
    });

    const handleResetPassword: SubmitHandler<ResetForm> = async (data) => {
        try {
            await resetPassword.mutateAsync(data);
            toast.success('Password reset link sent to your email');
            reset();
            onClose();
        } catch (error: any) {
            if (error.validation) {
                Object.entries(error.validation).forEach(([key, value]) =>
                    setError(key as keyof ResetForm, { message: value as string })
                );
            } else {
                toast.error(error.message || 'Failed to send reset link');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-3">
            <InputField
                icon={Mail}
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                {...register('email')}
                error={errors.email?.message}
            />

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded-lg bg-yellow-500 text-gray-900 font-medium text-sm
                            hover:bg-yellow-400 transition-colors duration-300 mt-6 disabled:opacity-50
                            disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
                <span>{isSubmitting ? 'Processing...' : 'Send Reset Link'}</span>
                <ChevronRight className="w-4 h-4" />
            </button>

            <div className="text-center mt-4">
                <button
                    type="button"
                    onClick={() => onModeChange('login')}
                    className="text-sm text-gray-400 hover:text-yellow-500 transition-colors duration-300"
                >
                    Back to Sign In
                </button>
            </div>
        </form>
    );
};

export { ForgotPasswordForm };
