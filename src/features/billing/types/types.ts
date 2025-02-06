export interface PaymentMethod {
    id: string;
    type: 'card' | 'klarna';
    is_default: boolean;
    last_four?: string;
    expiry_month?: string;
    expiry_year?: string;
    created_at: string;
  }
  
  export interface PaymentPlan {
    id: string;
    total_amount: number;
    starter_fee: number;
    mid_payment: number;
    final_payment: number;
    payments: Array<{
      id: string;
      payment_type: 'starter' | 'milestone' | 'final';
      payment_method: 'card' | 'klarna';
      amount: number;
      status: string;
      paid_at: string | null;
    }>;
    created_at: string;
  }