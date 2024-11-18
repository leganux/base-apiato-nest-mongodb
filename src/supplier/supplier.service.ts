import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './schemas/supplier.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class SupplierService extends ApiatoService<
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto
> {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
  ) {
    super(supplierModel, {});
  }
}
