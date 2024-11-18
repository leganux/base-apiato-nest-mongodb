import { IsBoolean, IsObject, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class EnvironmentConfigDto {
  @IsString()
  baseUrl: string;

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
  expeditionPlace?: string;

  @IsString()
  @IsOptional()
  currency?: string;
}

export class UpdateBillConfigDto {
  @IsBoolean()
  @IsOptional()
  isDevelopment?: boolean;

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
  isActive?: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => DefaultSettingsDto)
  @IsOptional()
  defaultSettings?: DefaultSettingsDto;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allowedRFCs?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
