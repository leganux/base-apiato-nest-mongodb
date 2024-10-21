import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class UserService extends ApiatoService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel, {});
  }
}
