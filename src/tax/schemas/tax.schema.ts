import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum TaxNameEnum {
  IVA = 'IVA',
  ISR = 'ISR',
  NONE = 'NONE',
}

export type TaxDocument = Tax & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Tax {
  @Prop({ required: true, enum: ['IVA', 'ISR', 'NONE'], default: "NONE" })
  name: TaxNameEnum;

  @Prop()
  description: string;

  @Prop()
  key: string;

  @Prop()
  notes: string;

  @Prop({ required: true, default: 0 })
  value: number;

  @Prop({ required: true, default: false })
  IsRetention: boolean;

  @Prop({ required: true, default: true })
  IsFederalTax: boolean;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deletedAt: Date;
}

export const TaxSchema = SchemaFactory.createForClass(Tax);