import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createStripeClient,
  CreatedPaymentIntent,
  StripeClient,
} from './stripe-client';
import { CreateChargeDto } from '@app/common/dto/create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: StripeClient;

  constructor(private readonly configService: ConfigService) {
    this.stripe = createStripeClient(
      this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCharge({
    amount,
  }: CreateChargeDto): Promise<CreatedPaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'pln',
      payment_method: 'pm_card_visa',
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    return paymentIntent;
  }
}
