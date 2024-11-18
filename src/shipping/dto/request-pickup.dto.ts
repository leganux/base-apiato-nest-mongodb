import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingCarrierEnum } from '../interfaces/shipping.interface';

export class RequestPickupDto {
  @IsNotEmpty()
  @IsString()
  shipping_id: string;

  @IsNotEmpty()
  @IsEnum(ShippingCarrierEnum)
  carrier: ShippingCarrierEnum;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  pickup_date: Date;

  @IsOptional()
  @IsString()
  pickup_time?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tracking_numbers?: string[];

  @IsOptional()
  @IsNumber()
  pieces?: number;

  @IsOptional()
  @IsString()
  special_instructions?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
