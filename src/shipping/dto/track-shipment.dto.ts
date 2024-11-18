import { IsNotEmpty, IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { ShippingCarrierEnum } from '../interfaces/shipping.interface';

export class TrackShipmentDto {
  @IsNotEmpty()
  @IsString()
  shipping_id: string;

  @IsNotEmpty()
  @IsEnum(ShippingCarrierEnum)
  carrier: ShippingCarrierEnum;

  @IsNotEmpty()
  @IsString()
  tracking_number: string;

  @IsOptional()
  @IsString()
  reference?: string;
}

export class TrackMultipleShipmentsDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tracking_numbers: string[];

  @IsNotEmpty()
  @IsEnum(ShippingCarrierEnum)
  carrier: ShippingCarrierEnum;
}
