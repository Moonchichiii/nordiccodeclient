import { 
    useQuery, 
    useMutation,
    useQueryClient 
  } from '@tanstack/react-query';
  import { billingApi } from '@/features/billing/api/billing';
  
  export function usePaymentMethods() {
    const queryClient = useQueryClient();
  
    const paymentMethods = useQuery({
      queryKey: ['payment-methods'],
      queryFn: () => billingApi.getPaymentMethods()
        .then(response => response.data)
    });
  
    const addPaymentMethod = useMutation({
      mutationFn: ({ paymentMethodId, setDefault }: {
        paymentMethodId: string;
        setDefault: boolean;
      }) => billingApi.addPaymentMethod(paymentMethodId, setDefault),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      }
    });
  
    const setDefaultPaymentMethod = useMutation({
      mutationFn: (paymentMethodId: string) => 
        billingApi.setDefaultPaymentMethod(paymentMethodId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      }
    });
  
    return {
      paymentMethods: paymentMethods.data ?? [],
      isLoading: paymentMethods.isLoading,
      error: paymentMethods.error,
      addPaymentMethod,
      setDefaultPaymentMethod
    };
  }
  