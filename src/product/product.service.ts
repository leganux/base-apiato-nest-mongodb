import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class ProductService extends ApiatoService<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {
    super(productModel, {});
  }
}
