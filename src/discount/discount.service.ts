import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Discount } from './schemas/discount.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class DiscountService extends ApiatoService<
  Discount,
  CreateDiscountDto,
  UpdateDiscountDto
> {
  constructor(@InjectModel(Discount.name) private discountModel: Model<Discount>) {
    super(discountModel, {});
  }
}
