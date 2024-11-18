import { Controller } from '@nestjs/common';
import { CreateMeasurement_unitDto } from './dto/create-measurement_unit.dto';
import { UpdateMeasurement_unitDto } from './dto/update-measurement_unit.dto';
import { Measurement_unitService } from './measurement_unit.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Measurement_unit')
@Controller('/api/v1/measurement_unit')
export class Measurement_unitController extends ApiatoController<
  CreateMeasurement_unitDto,
  UpdateMeasurement_unitDto,
  Measurement_unitService
> {
  constructor(private readonly measurement_unitService: Measurement_unitService) {
    super(measurement_unitService);
  }
}
