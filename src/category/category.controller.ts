import { Controller } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryService } from './category.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('/api/v1/category')
export class CategoryController extends ApiatoController<
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryService
> {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
}
