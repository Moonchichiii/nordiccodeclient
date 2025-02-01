import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export async function handleCardPayment(clientSecret: string) {
  const stripe = await getStripe();
  if (!stripe) throw new Error('Failed to load Stripe');

  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
  if (error) throw error;
  
  return paymentIntent;
}

