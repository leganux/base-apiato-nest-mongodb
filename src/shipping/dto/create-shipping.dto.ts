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
  ShippingCarrierEnum,
  ShippingModuleEnum,
  ShippingStatusEnum,
  ShippingTypeEnum,
} from '../interfaces/shipping.interface';

export class CreateShippingDto {
  @IsNotEmpty()
  @IsEnum(ShippingCarrierEnum)
  carrier: ShippingCarrierEnum;

  @IsNotEmpty()
  @IsMongoId()
  client: string;

  @IsOptional()
  @IsString()
  webhooks: string;

  @IsNotEmpty()
  @IsEnum(ShippingStatusEnum)
  status: ShippingStatusEnum;

  @IsNotEmpty()
  @IsEnum(ShippingModuleEnum)
  module: ShippingModuleEnum;

  @IsNotEmpty()
  @IsEnum(ShippingTypeEnum)
  type: ShippingTypeEnum;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsNumber()
  no_products: number;

  @IsOptional()
  @IsDate()
  date_quoted: Date;

  @IsOptional()
  @IsDate()
  date_labeled: Date;

  @IsOptional()
  @IsDate()
  date_picked_up: Date;

  @IsOptional()
  @IsDate()
  date_tracked: Date;

  @IsOptional()
  @IsDate()
  date_cancelled: Date;

  @IsOptional()
  @IsDate()
  date_rejected: Date;
}
