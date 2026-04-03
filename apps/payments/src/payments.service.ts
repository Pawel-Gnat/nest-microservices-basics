import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createStripeClient,
  CreatedPaymentIntent,
  StripeClient,
} from './stripe-client';
import { CreateChargeDto } from './dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: StripeClient;

  constructor(private readonly configService: ConfigService) {
    this.stripe = createStripeClient(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  createCharge({
    amount,
    paymentMethodId,
  }: CreateChargeDto): Promise<CreatedPaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      payment_method_types: ['card'],
    });
  }
}
