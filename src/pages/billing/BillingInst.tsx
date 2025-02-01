// src/pages/billing/BillingInst.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentFlow from '@/features/billing/components/BillingComponent'; // or something similar
import { ArrowLeft } from 'lucide-react';

interface BillingInstState {
  selectedPackage?: any; // or the real type
  selectedAddons?: string[];
  totalPrice?: number;
}

const BillingInst: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState<boolean>(false);

  // read from location.state
  const { selectedPackage, selectedAddons, totalPrice } = (location.state || {}) as BillingInstState;

  // If none of that is present, user might have come here incorrectly
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
    // For dev: skip payment and jump to the planner route
    navigate('/dashboard/planner', {
      state: { selectedPackage, selectedAddons, totalPrice }
    });
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
            <button
              onClick={handleSkip}
              className="py-3 px-4 rounded-lg text-sm font-medium bg-gray-700/50 text-gray-200 hover:bg-gray-700"
            >
              Skip Payment (Dev)
            </button>
          </div>
        )}

        {showPayment && (
          <div className="mt-6">
            {/* Show your PaymentFlow / PaymentForm logic here */}
            <p className="text-yellow-400 mb-2">Demo Payment Flow Here…</p>
            <PaymentFlow
              projectId="123" // or real project ID from your system
              onComplete={() =>
                navigate('/dashboard/planner', {
                  state: { selectedPackage, selectedAddons, totalPrice }
                })
              }
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default BillingInst;
