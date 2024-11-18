import { Controller } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierService } from './supplier.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Supplier')
@Controller('/api/v1/supplier')
export class SupplierController extends ApiatoController<
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierService
> {
  constructor(private readonly supplierService: SupplierService) {
    super(supplierService);
  }
}
