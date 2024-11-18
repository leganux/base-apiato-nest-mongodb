import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type Measurement_unitDocument = Measurement_unit & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Measurement_unit {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  ISO: string;

  @Prop()
  key: string;

  @Prop()
  sub_count: number;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deletedAt: Date;
}

export const Measurement_unitSchema = SchemaFactory.createForClass(Measurement_unit);