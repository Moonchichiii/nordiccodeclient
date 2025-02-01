import axios from '@/lib/axios';
import { type PaymentMethod, type PaymentPlan } from '../types';

export const billingApi = {
  // Payment Methods
  getPaymentMethods: () => 
    axios.get<PaymentMethod[]>('/api/billing/payment-methods/'),
  
  addPaymentMethod: (paymentMethodId: string, setDefault: boolean) =>
    axios.post<PaymentMethod>('/api/billing/payment-methods/add-card/', {
      payment_method_id: paymentMethodId,
      set_default: setDefault
    }),

  setDefaultPaymentMethod: (paymentMethodId: string) =>
    axios.post<PaymentMethod>(`/api/billing/payment-methods/${paymentMethodId}/set-default/`),

  // Payment Plans
  getPaymentPlan: (projectId: string) =>
    axios.get<PaymentPlan>(`/api/billing/payment-plans/${projectId}/`),
  
  initiateStarterPayment: (projectId: string, paymentMethod: string) =>
    axios.post<{client_secret: string; payment_id: string}>(
      `/api/billing/payment-plans/${projectId}/initiate-starter-payment/`,
      { payment_method: paymentMethod }
    )
};
