import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { BillStatus, CFDIUseEnum, PaymentFormEnum, PaymentMethodEnum } from '../interfaces/facturama.interface';

export type BillDocument = Bill & Document;

@Schema({ 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Bill {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Payment' })
  payment: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'UserAddress' })
  billing_address: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'BillConfig' })
  config: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  rfc: string;

  @Prop({ required: true })
  business_name: string;

  @Prop({ required: true, enum: Object.values(CFDIUseEnum) })
  cfdi_use: CFDIUseEnum;

  @Prop({ required: true, enum: Object.values(PaymentFormEnum) })
  payment_form: PaymentFormEnum;

  @Prop({ required: true, enum: Object.values(PaymentMethodEnum) })
  payment_method: PaymentMethodEnum;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, enum: Object.values(BillStatus), default: BillStatus.PENDING })
  status: BillStatus;

  @Prop()
  facturama_id?: string;

  @Prop()
  uuid?: string;

  @Prop()
  serie?: string;

  @Prop()
  folio?: string;

  @Prop()
  pdf_url?: string;

  @Prop()
  xml_url?: string;

  @Prop()
  cancelation_reason?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  facturama_response?: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed })
  error?: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Date })
  generated_at?: Date;

  @Prop({ type: MongooseSchema.Types.Date })
  cancelled_at?: Date;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deleted_at?: Date;
}

export const BillSchema = SchemaFactory.createForClass(Bill);

// Indexes
BillSchema.index({ payment: 1 });
BillSchema.index({ user: 1 });
BillSchema.index({ billing_address: 1 });
BillSchema.index({ config: 1 });
BillSchema.index({ rfc: 1 });
BillSchema.index({ status: 1 });
BillSchema.index({ facturama_id: 1 });
BillSchema.index({ uuid: 1 });
BillSchema.index({ generated_at: 1 });
BillSchema.index({ cancelled_at: 1 });
BillSchema.index({ deleted_at: 1 });

// Virtual populate for related documents
BillSchema.virtual('payment_details', {
  ref: 'Payment',
  localField: 'payment',
  foreignField: '_id',
  justOne: true
});

BillSchema.virtual('user_details', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

BillSchema.virtual('address_details', {
  ref: 'UserAddress',
  localField: 'billing_address',
  foreignField: '_id',
  justOne: true
});

BillSchema.virtual('config_details', {
  ref: 'BillConfig',
  localField: 'config',
  foreignField: '_id',
  justOne: true
});
