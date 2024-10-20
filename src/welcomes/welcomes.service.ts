import { Injectable } from '@nestjs/common';
import { CreateWelcomeDto } from './dto/create-welcome.dto';
import { UpdateWelcomeDto } from './dto/update-welcome.dto';

@Injectable()
export class WelcomesService {
  create(createWelcomeDto: CreateWelcomeDto) {
    return 'This action adds a new welcome';
  }

  findAll() {
    return `This action returns all welcomes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} welcome`;
  }

  update(id: number, updateWelcomeDto: UpdateWelcomeDto) {
    return `This action updates a #${id} welcome`;
  }

  remove(id: number) {
    return `This action removes a #${id} welcome`;
  }
}
