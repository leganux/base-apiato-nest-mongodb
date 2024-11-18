import { IsString, IsEmail, IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { CFDIUseEnum, PaymentFormEnum, PaymentMethodEnum } from '../interfaces/facturama.interface';

export class CreateBillDto {
  @IsMongoId()
  @IsNotEmpty()
  payment: string;

  @IsMongoId()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  rfc: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsEnum(CFDIUseEnum)
  cfdiUse: CFDIUseEnum;

  @IsEnum(PaymentFormEnum)
  paymentForm: PaymentFormEnum;

  @IsEnum(PaymentMethodEnum)
  paymentMethod: PaymentMethodEnum;

  @IsEmail()
  email: string;
}
