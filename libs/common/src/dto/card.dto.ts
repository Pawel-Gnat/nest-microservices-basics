import { Type } from 'class-transformer';
import {
  IsCreditCard,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  exp_month: number;

  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  exp_year: number;

  @IsCreditCard()
  number: string;
}
