import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class CategoryService extends ApiatoService<
  Category,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) {
    super(categoryModel, {});
  }
}
