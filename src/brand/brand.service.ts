import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schemas/brand.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class BrandService extends ApiatoService<
  Brand,
  CreateBrandDto,
  UpdateBrandDto
> {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {
    super(brandModel, {});
  }
}
