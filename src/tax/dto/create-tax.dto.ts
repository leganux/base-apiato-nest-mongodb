import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDate } from 'class-validator';
import { TaxNameEnum } from '../schemas/tax.schema';

export class CreateTaxDto {
  @IsNotEmpty()
  @IsEnum(TaxNameEnum)
  name: TaxNameEnum;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsBoolean()
  IsRetention: boolean;

  @IsNotEmpty()
  @IsBoolean()
  IsFederalTax: boolean;

}