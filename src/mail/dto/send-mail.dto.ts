import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Attachment {
  @IsString()
  filename: string;

  @IsString()
  path: string;
}

export class SendMailDto {
  @IsEmail()
  @IsOptional()
  from: string;

  @IsArray()
  @IsEmail({}, { each: true })
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attachment)
  attachments?: Attachment[];
}
