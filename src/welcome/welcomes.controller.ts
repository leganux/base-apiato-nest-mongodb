import { Controller, Get } from '@nestjs/common';
import { WelcomesService } from './welcomes.service';

@Controller('/')
export class WelcomesController {
  constructor(private readonly welcomesService: WelcomesService) {}

  @Get()
  home() {
    return this.welcomesService.home();
  }
}
