import { useMutation } from '@tanstack/react-query';
import { handleCardPayment } from '../utils/stripe';

export function useStripe() {
  const confirmPayment = useMutation({
    mutationFn: (clientSecret: string) => handleCardPayment(clientSecret)
  });

  return { confirmPayment };
}