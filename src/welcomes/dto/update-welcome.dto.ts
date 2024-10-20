import { PartialType } from '@nestjs/swagger';
import { CreateWelcomeDto } from './create-welcome.dto';

export class UpdateWelcomeDto extends PartialType(CreateWelcomeDto) {}
