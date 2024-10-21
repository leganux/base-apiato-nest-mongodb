import { Controller } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('User')
@Controller('/api/v1/user')
export class UserController extends ApiatoController<
  CreateUserDto,
  UpdateUserDto,
  UserService
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
