import { IsNumber, IsString, Min } from 'class-validator';

export class CreateChargeDto {
  @IsString()
  paymentMethodId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}
