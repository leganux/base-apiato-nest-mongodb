import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingCarrierEnum } from '../interfaces/shipping.interface';
import { AddressDto, PackageDto } from './generateQuote.dto';

export class GenerateLabelDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  origin: AddressDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  destination: AddressDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages: PackageDto[];

  @IsNotEmpty()
  @IsEnum(ShippingCarrierEnum)
  carrier: ShippingCarrierEnum;

  @IsNotEmpty()
  @IsString()
  service_level: string;

  @IsNotEmpty()
  @IsString()
  rate_id: string;

  @IsOptional()
  @IsBoolean()
  return_label?: boolean;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
