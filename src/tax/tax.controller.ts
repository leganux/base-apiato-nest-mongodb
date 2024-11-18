import { Controller } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { TaxService } from './tax.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tax')
@Controller('/api/v1/tax')
export class TaxController extends ApiatoController<
  CreateTaxDto,
  UpdateTaxDto,
  TaxService
> {
  constructor(private readonly taxService: TaxService) {
    super(taxService);
  }
}
