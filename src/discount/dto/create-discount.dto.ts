import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDate } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

}