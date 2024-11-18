import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tax } from './schemas/tax.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class TaxService extends ApiatoService<
  Tax,
  CreateTaxDto,
  UpdateTaxDto
> {
  constructor(@InjectModel(Tax.name) private taxModel: Model<Tax>) {
    super(taxModel, {});
  }
}
