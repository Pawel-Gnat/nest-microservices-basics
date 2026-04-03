import Stripe from 'stripe';

export type StripeClient = Stripe.Stripe;

export type CreatedPaymentIntent = Awaited<
  ReturnType<StripeClient['paymentIntents']['create']>
>;

export function createStripeClient(apiKey: string): StripeClient {
  const StripeConstructor = Stripe as unknown as new (
    apiKey: string,
    config?: Record<string, unknown>,
  ) => StripeClient;

  return new StripeConstructor(apiKey);
}
