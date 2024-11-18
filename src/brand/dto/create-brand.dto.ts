import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDate } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  key: string;

}