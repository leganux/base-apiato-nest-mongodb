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
}

export class GenerateQuoteWithAddressesDto {
  @IsNotEmpty()
  @IsString()
  originAddressId: string;

  @IsNotEmpty()
  @IsString()
  destinationAddressId: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PackageDto)
  packages: PackageDto[];

  @IsOptional()
  @IsArray()
  @IsEnum(ShippingCarrierEnum, { each: true })
  carriers?: ShippingCarrierEnum[];
}
