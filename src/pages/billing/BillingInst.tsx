import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentFlow from '@/features/billing/components/BillingComponent';
import { ArrowLeft } from 'lucide-react';
import axios from '@/lib/axios';
import { useAuthContext } from '@/features/auth/components/AuthProvider';
import { toast } from 'react-toastify';

interface IBillingInstState {
    selectedPackage?: {
        title: string;
        priceEUR: number;
        projectId: string;
    };
    selectedAddons?: string[];
    totalPrice?: number;
}

const BillingInst: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [showPayment, setShowPayment] = useState(false);
    const [showAdminSkip, setShowAdminSkip] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await axios.get('/api/users/me/');
                setShowAdminSkip(response.data.is_staff || response.data.is_superuser);
            } catch (err) {
                console.error('Failed to check admin status:', err);
            }
        };
        checkAdmin();
    }, []);

    const { selectedPackage, selectedAddons, totalPrice } = (location.state || {}) as IBillingInstState;

    if (!selectedPackage) {
        return (
            <div className="bg-red-500/10 border border-red-500 p-4 rounded-lg">
                No package or add-on data found. Please go back and select a package.
            </div>
        );
    }

    const handleBack = () => {
        navigate(-1);
    };

    const handleSkip = () => {
        navigate('/dashboard/planner', {
            state: { selectedPackage, selectedAddons, totalPrice }
        });
    };

    const handleAdminSkip = async () => {
        try {
            await axios.patch(`/api/projects/${selectedPackage.projectId}/`, {
                status: 'planning',
                is_planning_locked: false
            });

            navigate('/dashboard/planner', {
                state: { projectId: selectedPackage.projectId, selectedPackage, selectedAddons }
            });
        } catch (err) {
            toast.error('Failed to skip payment');
        }
    };

    return (
        <main className="w-full max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={handleBack} className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-light text-white">Billing Instructions</h2>
            </div>

            <div className="p-6 rounded-xl bg-gray-800/50 space-y-4">
                <h3 className="text-xl font-light text-white">Starter Fee Payment</h3>
                <p className="text-sm text-gray-400">
                    Please pay a small commitment fee to secure your project slot. This will be deducted from your final total.
                </p>

                <div className="bg-gray-900/50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-gray-300">
                        <strong>Package:</strong> {selectedPackage.title} 
                        <br />
                        <strong>Selected Add-ons:</strong> {selectedAddons?.length ? selectedAddons.join(', ') : 'None'}
                        <br />
                        <strong>Total Price (EUR):</strong> {totalPrice ?? selectedPackage.priceEUR}
                    </p>
                </div>

                {!showPayment && (
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            onClick={() => setShowPayment(true)}
                            className="py-3 px-4 rounded-lg text-sm font-medium bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                )}

                {showPayment && (
                    <div className="mt-6">
                        <p className="text-yellow-400 mb-2">Demo Payment Flow Here…</p>
                        <PaymentFlow
                            projectId={selectedPackage.projectId}
                            onComplete={() =>
                                navigate('/dashboard/planner', {
                                    state: { selectedPackage, selectedAddons, totalPrice }
                                })
                            }
                        />
                    </div>
                )}

                {showAdminSkip && (
                    <button
                        onClick={handleAdminSkip}
                        className="mt-4 py-2 px-4 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                        Skip Payment (Admin Only)
                    </button>
                )}
            </div>
        </main>
    );
};

export default BillingInst;