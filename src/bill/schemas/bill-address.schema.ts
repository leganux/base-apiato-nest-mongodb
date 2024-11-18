import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BillAddressDocument = BillAddress & Document;

@Schema({ _id: false })
export class BillAddress {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  exteriorNumber: string;

  @Prop()
  interiorNumber?: string;

  @Prop({ required: true })
  neighborhood: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop()
  locality?: string;

  @Prop({ required: true })
  municipality: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;
}

export const BillAddressSchema = SchemaFactory.createForClass(BillAddress);
