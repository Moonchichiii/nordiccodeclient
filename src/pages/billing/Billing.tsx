import React from 'react';
import { usePaymentMethods } from '@/features/billing/hooks/usePaymentMethods';
import { Loader2, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import CardForm from '@/features/billing/CardForm';

const Billing: React.FC = () => {
  const { paymentMethods, isLoading, error } = usePaymentMethods();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-destructive">Failed to load payment methods.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background">
      <h2 className="text-xl font-medium mb-6 text-foreground">Billing & Payment Management</h2>
      {paymentMethods && paymentMethods.length > 0 ? (
        <div className="space-y-8">
          <h3 className="text-lg font-semibold text-foreground">Your Saved Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map(method => (
              <div 
                key={method.id} 
                className="p-4 rounded-lg bg-card border border-border hover:border-primary/50 
                         transition-all duration-300 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-foreground">•••• {method.last_four}</div>
                    <div className="text-sm text-muted-foreground">
                      Expires {method.expiry_month}/{method.expiry_year}
                    </div>
                  </div>
                </div>
                {method.is_default && <span className="text-sm text-primary">Default</span>}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CardForm
              onSuccess={() => toast.success('Card updated successfully!')}
              onError={(error) => toast.error(error)}
            />
          </div>
        </div>
      ) : (
        <div className="text-center p-6">
          <p className="text-muted-foreground">
            No payment methods found. Please add a payment method to manage billing.
          </p>
          <div className="mt-4">
            <CardForm
              onSuccess={() => toast.success('Card added successfully!')}
              onError={(error) => toast.error(error)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;