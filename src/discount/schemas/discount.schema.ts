import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DiscountDocument = Discount & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Discount {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  key: string;

  @Prop({ required: true, default: 0 })
  value: number;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deletedAt: Date;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);