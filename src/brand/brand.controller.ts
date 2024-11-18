import { Controller } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandService } from './brand.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Brand')
@Controller('/api/v1/brand')
export class BrandController extends ApiatoController<
  CreateBrandDto,
  UpdateBrandDto,
  BrandService
> {
  constructor(private readonly brandService: BrandService) {
    super(brandService);
  }
}
