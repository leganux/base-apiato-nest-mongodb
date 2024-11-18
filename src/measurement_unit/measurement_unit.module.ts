import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Measurement_unitController } from './measurement_unit.controller';
import { Measurement_unitService } from './measurement_unit.service';
import { Measurement_unit, Measurement_unitSchema } from './schemas/measurement_unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Measurement_unit.name, schema: Measurement_unitSchema }])
  ],
  controllers: [Measurement_unitController],
  providers: [Measurement_unitService],
  exports: [Measurement_unitService],
})
export class Measurement_unitModule {}
