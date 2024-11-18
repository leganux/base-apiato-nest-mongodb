import { PartialType } from '@nestjs/mapped-types';
import { CreateMeasurement_unitDto } from './create-measurement_unit.dto';

export class UpdateMeasurement_unitDto extends PartialType(CreateMeasurement_unitDto) {}
