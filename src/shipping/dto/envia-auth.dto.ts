import { IsNotEmpty, IsString } from 'class-validator';

export class EnviaAuthDto {
  @IsNotEmpty()
  @IsString()
  apiKey: string;
}
