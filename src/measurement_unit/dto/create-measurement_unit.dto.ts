import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDate } from 'class-validator';

export class CreateMeasurement_unitDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  ISO: string;

  @IsOptional()
  @IsString()
  key: string;

  @IsOptional()
  @IsNumber()
  sub_count: number;

}