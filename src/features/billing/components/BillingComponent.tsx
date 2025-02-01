import { useState } from 'react';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { usePaymentPlan } from '../hooks/usePaymentPlan';
import { CreditCard, Loader2, Check, AlertCircle } from 'lucide-react';

interface PaymentFlowProps {
  projectId: string;
  onComplete: () => void;
}

export default function PaymentFlow({ projectId, onComplete }: PaymentFlowProps) {
  const [step, setStep] = useState<'method' | 'confirm'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const {
    paymentMethods,
    isLoading: methodsLoading,
    addPaymentMethod
  } = usePaymentMethods();

  const {
    paymentPlan,
    isLoading: planLoading,
    initiatePayment
  } = usePaymentPlan(projectId);

  if (methodsLoading || planLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  const handlePaymentMethod = async (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('confirm');
  };

  const handlePaymentSubmit = async () => {
    if (!selectedMethod) return;
    
    try {
      const { data } = await initiatePayment.mutateAsync(selectedMethod);
      
      // Handle Stripe confirmation if needed
      if (data.client_secret) {
        // Implement Stripe confirmation flow
      } else {
        onComplete();
      }
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {step === 'method' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Select Payment Method</h3>
          
          <div className="grid gap-4">
            {paymentMethods.map(method => (
              <button
                key={method.id}
                onClick={() => handlePaymentMethod(method.id)}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-700/50 hover:border-yellow-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">
                      •••• {method.last_four}
                    </div>
                    <div className="text-sm text-gray-400">
                      Expires {method.expiry_month}/{method.expiry_year}
                    </div>
                  </div>
                </div>
                {method.is_default && (
                  <span className="text-sm text-yellow-500">Default</span>
                )}
              </button>
            ))}
            
            {/* Add new card button */}
            <button 
              onClick={() => {/* Implement add card flow */}}
              className="flex items-center gap-2 p-4 rounded-lg border border-dashed border-gray-700/50 hover:border-yellow-500/50 text-gray-400 hover:text-yellow-500 transition-all"
            >
              <CreditCard className="w-5 h-5" />
              Add New Card
            </button>
          </div>
        </div>
      )}

      {step === 'confirm' && paymentPlan && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Payment Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Starter Fee</span>
                <span className="text-white">€{paymentPlan.starter_fee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Future Payments</span>
                <span className="text-white">€{paymentPlan.mid_payment + paymentPlan.final_payment}</span>
              </div>
              <div className="pt-2 border-t border-gray-700/50">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-400">Total Project Cost</span>
                  <span className="text-white">€{paymentPlan.total_amount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('method')}
              className="flex-1 py-3 px-4 rounded-lg border border-gray-700/50 text-gray-400 hover:text-white hover:border-gray-600 transition-all"
            >
              Back
            </button>
            <button
              onClick={handlePaymentSubmit}
              disabled={initiatePayment.isPending}
              className="flex-1 py-3 px-4 rounded-lg bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-yellow-500 transition-all"
            >
              {initiatePayment.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Confirm Payment'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}