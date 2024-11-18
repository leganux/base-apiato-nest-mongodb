import { Controller } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('/api/v1/product')
export class ProductController extends ApiatoController<
  CreateProductDto,
  UpdateProductDto,
  ProductService
> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }
}
