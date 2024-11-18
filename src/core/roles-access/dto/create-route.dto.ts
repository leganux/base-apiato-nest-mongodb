import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsArray()
  @IsNotEmpty()
  roles: string[];
}
