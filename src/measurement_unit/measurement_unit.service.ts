import { Injectable } from '@nestjs/common';
import { CreateMeasurement_unitDto } from './dto/create-measurement_unit.dto';
import { UpdateMeasurement_unitDto } from './dto/update-measurement_unit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Measurement_unit } from './schemas/measurement_unit.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class Measurement_unitService extends ApiatoService<
  Measurement_unit,
  CreateMeasurement_unitDto,
  UpdateMeasurement_unitDto
> {
  constructor(@InjectModel(Measurement_unit.name) private measurement_unitModel: Model<Measurement_unit>) {
    super(measurement_unitModel, {});
  }
}
