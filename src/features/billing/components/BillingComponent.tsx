import { useState } from 'react';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { usePaymentPlan } from '../hooks/usePaymentPlan';
import { 
  CreditCard, 
  Loader2, 
  Check, 
  AlertCircle, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Clock
} from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg font-medium">Loading payment details...</span>
        </div>
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

  const SectionHeader = ({ icon: Icon, title, description }: { icon: any; title: string; description?: string }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-light text-foreground">Payment Details</h2>
          <p className="text-sm text-muted-foreground">
            {step === 'method' ? 'Select your payment method' : 'Review and confirm your payment'}
          </p>
        </div>
      </div>

      {step === 'method' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Saved Payment Methods */}
            <div className="space-y-4 rounded-xl border border-border/50 p-6">
              <SectionHeader
                icon={CreditCard}
                title="Saved Payment Methods"
                description="Select from your saved cards"
              />
              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethod(method.id)}
                    className="group w-full flex items-center justify-between p-4 rounded-lg border border-border/50 
                             hover:border-primary/50 hover:bg-accent/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="text-left">
                        <div className="font-medium text-foreground">•••• {method.last_four}</div>
                        <div className="text-sm text-muted-foreground">
                          Expires {method.expiry_month}/{method.expiry_year}
                        </div>
                      </div>
                    </div>
                    {method.is_default && (
                      <span className="text-sm text-primary">Default</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Add New Card */}
            <div className="space-y-4 rounded-xl border border-border/50 p-6">
              <SectionHeader
                icon={PlusCircle}
                title="Add New Card"
                description="Securely add a new payment method"
              />
              <button 
                onClick={() => {/* Implement add card flow */}}
                className="w-full flex items-center gap-3 p-4 rounded-lg border border-dashed border-border/50 
                         hover:border-primary/50 hover:bg-accent/50 text-muted-foreground hover:text-primary 
                         transition-all duration-300"
              >
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Add New Payment Method</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'confirm' && paymentPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Summary */}
          <div className="space-y-4 rounded-xl border border-border/50 p-6">
            <SectionHeader
              icon={Clock}
              title="Payment Schedule"
              description="Review your payment timeline"
            />
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                <span className="text-sm text-foreground">Starter Fee</span>
                <span className="font-medium text-foreground">€{paymentPlan.starter_fee}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                <span className="text-sm text-foreground">Future Payments</span>
                <span className="font-medium text-foreground">
                  €{paymentPlan.mid_payment + paymentPlan.final_payment}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                <span className="text-sm font-medium text-foreground">Total Project Cost</span>
                <span className="text-lg font-bold text-foreground">€{paymentPlan.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end space-y-4 rounded-xl border border-border/50 p-6">
            <SectionHeader
              icon={Calendar}
              title="Confirm Payment"
              description="Review and process your payment"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep('method')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg 
                         border border-border/50 text-muted-foreground hover:text-foreground 
                         hover:border-primary/50 transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={initiatePayment.isPending}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg 
                         bg-primary text-primary-foreground hover:bg-primary/90 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {initiatePayment.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Confirm Payment
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}