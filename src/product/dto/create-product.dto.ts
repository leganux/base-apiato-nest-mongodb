import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDate } from 'class-validator';
import { IsMongoId } from 'class-validator';
import { ProductCategoryEnum } from '../schemas/product.schema';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  stock: string;

  @IsNotEmpty()
  @IsEnum(ProductCategoryEnum)
  category: ProductCategoryEnum;

  @IsNotEmpty()
  @IsMongoId()
  brand: string;

}