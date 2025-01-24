// OrderFlow.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface OrderDetails {
  id: string;
  package: {
    name: string;
  };
  deposit_amount: number;
  remaining_amount: number;
  total_amount: number;
  status: string;
}

export default function OrderFlow() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const { data: order, isLoading, error } = useQuery<OrderDetails>({
    queryKey: ['order', projectId],
    queryFn: async () => {
      const response = await fetch('/api/orders/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId })
      });
      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
    }
  });

  const createPaymentSession = useMutation({
    mutationFn: async () => {
      setProcessing(true);
      const intentResponse = await fetch(`/api/orders/${order?.id}/process-deposit`, {
        method: 'POST'
      });
      if (!intentResponse.ok) throw new Error('Failed to create payment session');
      const { client_secret, payment_id } = await intentResponse.json();

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not initialized');

      const { error: stripeError } = await stripe.confirmCardPayment(client_secret);
      if (stripeError) throw new Error(stripeError.message);

      await fetch(`/api/orders/${order?.id}/confirm-deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id })
      });

      navigate(`/dashboard/planner/${projectId}`);
    },
    onError: (error) => {
      console.error('Payment Error:', error);
      setProcessing(false);
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-500 mb-2">Payment Error</h3>
        <p className="text-gray-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-xl font-medium mb-6">Project Payment Details</h2>
        
        <div className="space-y-6">
          <div className="flex justify-between pb-4 border-b border-gray-700/50">
            <span className="text-gray-400">Selected Package</span>
            <span className="font-medium">{order?.package?.name}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Initial Deposit (30%)</span>
              <span className="font-medium">€{order?.deposit_amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Remaining Balance</span>
              <span className="font-medium">€{order?.remaining_amount}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-700/50">
              <span className="text-gray-400">Total Project Cost</span>
              <span className="font-medium">€{order?.total_amount}</span>
            </div>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div className="flex-1 text-sm text-gray-300">
                <p className="font-medium mb-1">Secure Payment & Guarantee</p>
                <p>Your deposit is fully refundable within 48 hours if you choose not to proceed. 
                All payments are processed securely through Stripe.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => createPaymentSession.mutate()}
            disabled={processing || order?.status === 'deposit_paid'}
            className="w-full py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                     flex items-center justify-center space-x-2"
          >
            <CreditCard className="h-5 w-5" />
            <span>{processing ? 'Processing...' : 'Process Deposit Payment'}</span>
          </button>

          {order?.status === 'deposit_paid' && (
            <div className="flex items-center justify-center space-x-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span>Deposit payment successful</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}