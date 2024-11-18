import { IsBoolean, IsObject, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EnvironmentConfigDto {
  @IsString()
  base_url: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}

class DefaultSettingsDto {
  @IsString()
  @IsOptional()
  serie?: string;

  @IsString()
  @IsOptional()
  expedition_place?: string;

  @IsString()
  @IsOptional()
  currency?: string;
}

export class UpdateBillConfigDto {
  @IsBoolean()
  @IsOptional()
  is_development?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => EnvironmentConfigDto)
  @IsOptional()
  sandbox?: EnvironmentConfigDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EnvironmentConfigDto)
  @IsOptional()
  production?: EnvironmentConfigDto;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => DefaultSettingsDto)
  @IsOptional()
  default_settings?: DefaultSettingsDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowed_rfcs?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
