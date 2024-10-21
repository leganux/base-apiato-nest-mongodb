import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WelcomesService } from './welcomes.service';
import { CreateWelcomeDto } from './dto/create-welcome.dto';
import { UpdateWelcomeDto } from './dto/update-welcome.dto';

@Controller('/')
export class WelcomesController {
  constructor(private readonly welcomesService: WelcomesService) {}

  @Get()
  home() {
    return this.welcomesService.home();
  }
}
