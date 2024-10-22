import { Controller, Get } from '@nestjs/common';
import { WelcomesService } from './welcomes.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Welcome and credits')
@Controller('/')
export class WelcomesController {
  constructor(private readonly welcomesService: WelcomesService) {}

  @Get()
  home() {
    return this.welcomesService.home();
  }
}
