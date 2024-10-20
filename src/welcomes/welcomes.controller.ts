import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WelcomesService } from './welcomes.service';
import { CreateWelcomeDto } from './dto/create-welcome.dto';
import { UpdateWelcomeDto } from './dto/update-welcome.dto';

@Controller('welcomes')
export class WelcomesController {
  constructor(private readonly welcomesService: WelcomesService) {}

  @Post()
  create(@Body() createWelcomeDto: CreateWelcomeDto) {
    return this.welcomesService.create(createWelcomeDto);
  }

  @Get()
  findAll() {
    return this.welcomesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.welcomesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWelcomeDto: UpdateWelcomeDto) {
    return this.welcomesService.update(+id, updateWelcomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.welcomesService.remove(+id);
  }
}
