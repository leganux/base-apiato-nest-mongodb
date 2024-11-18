import { IsNotEmpty, IsString, IsArray, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingCarrierEnum } from '../interfaces/shipping.interface';

class PackageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  weight: number;

  @IsNotEmpty()
  height: number;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  length: number;

  @IsOptional()
  insurance_amount?: number;

  @IsOptional()
  declared_value?: number;
}

export class GenerateLabelWithAddressesDto {
  @IsNotEmpty()
  @IsString()
  originAddressId: string;

  @IsNotEmpty()
  @IsString()
  destinationAddressId: string;

  @IsNotEmpty()
  @IsEnum(ShippingCarrierEnum)
  carrier: ShippingCarrierEnum;

  @IsNotEmpty()
  @IsString()
  service_level: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages: PackageDto[];

  @IsOptional()
  @IsString()
  rate_id?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
