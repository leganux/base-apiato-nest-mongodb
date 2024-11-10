import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDate } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  description: string;

}