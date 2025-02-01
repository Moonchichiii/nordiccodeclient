import { useQuery, useMutation } from '@tanstack/react-query';
import { billingApi } from '@/features/billing/api/api.billing';

export function usePaymentPlan(projectId: string) {
  const paymentPlan = useQuery({
    queryKey: ['payment-plan', projectId],
    queryFn: () => billingApi.getPaymentPlan(projectId)
      .then(response => response.data),
    enabled: !!projectId
  });

  const initiatePayment = useMutation({
    mutationFn: (paymentMethod: string) => 
      billingApi.initiateStarterPayment(projectId, paymentMethod)
  });

  return {
    paymentPlan: paymentPlan.data,
    isLoading: paymentPlan.isLoading,
    error: paymentPlan.error,
    initiatePayment
  };
}