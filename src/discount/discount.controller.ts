import { Controller } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { DiscountService } from './discount.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Discount')
@Controller('/api/v1/discount')
export class DiscountController extends ApiatoController<
  CreateDiscountDto,
  UpdateDiscountDto,
  DiscountService
> {
  constructor(private readonly discountService: DiscountService) {
    super(discountService);
  }
}
