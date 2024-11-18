import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { IsMongoId } from 'class-validator';
import { ProductStatusEnum } from '../interfaces/product.interface';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  sat_key: string;

  @IsOptional()
  @IsString()
  pricncipal_key: string;

  @IsOptional()
  @IsString()
  secondary_key: string;

  @IsOptional()
  @IsString()
  thertiary_key: string;

  @IsOptional()
  @IsString()
  barcode: string;

  @IsOptional()
  @IsString()
  QR: string;

  @IsOptional()
  images?: any;

  @IsNotEmpty()
  @IsMongoId()
  brand: string;

  @IsNotEmpty()
  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;

  @IsNotEmpty()
  @IsMongoId()
  measurement_unit: string;

  @IsNotEmpty()
  @IsMongoId()
  category: string;

  @IsNotEmpty()
  @IsMongoId()
  taxes: string;

  @IsNotEmpty()
  @IsMongoId()
  main_supplier: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsNumber()
  max: number;

  @IsNotEmpty()
  @IsNumber()
  min: number;

  @IsNotEmpty()
  @IsNumber()
  reorder: number;

  @IsNotEmpty()
  @IsMongoId()
  discount: string;
}
