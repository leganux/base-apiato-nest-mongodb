import {
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { UserRoleInterface } from '../interfaces/user.interface';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsDateString()
  bornDate?: Date;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsEnum(UserRoleInterface)
  role?: UserRoleInterface;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  picture?: string;
}
