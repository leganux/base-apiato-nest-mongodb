import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsDate,
} from 'class-validator';
import { IsMongoId } from 'class-validator';
import {
  PaymentModuleEnum,
  PaymentSourceEnum,
  PaymentStatusEnum,
} from '../interfaces/payment.interface';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentSourceEnum)
  source: PaymentSourceEnum;

  @IsNotEmpty()
  @IsMongoId()
  client: string;

  @IsOptional()
  @IsString()
  image_payment: string;

  @IsNotEmpty()
  @IsEnum(PaymentStatusEnum)
  status: PaymentStatusEnum;

  @IsNotEmpty()
  @IsEnum(PaymentModuleEnum)
  module: PaymentModuleEnum;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsNumber()
  no_products: number;

  @IsOptional()
  @IsDate()
  date_payment: Date;

  @IsOptional()
  @IsDate()
  date_cancelled: Date;

  @IsOptional()
  @IsDate()
  date_rejected: Date;
}
