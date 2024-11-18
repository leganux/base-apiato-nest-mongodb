import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  PaymentModuleEnum,
  PaymentSourceEnum,
  PaymentStatusEnum,
} from '../interfaces/payment.interface';

export type PaymentDocument = Payment & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Payment {
  @Prop({
    required: true,
    enum: ['CASH', 'OP_CARD', 'OP_SPEI', 'OP_STORE', 'MP_GENERAL'],
    default: 'CASH',
  })
  source: PaymentSourceEnum;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  client: MongooseSchema.Types.ObjectId;

  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Order',
  })
  order: MongooseSchema.Types.ObjectId;

  @Prop()
  image_payment: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'PAYED', 'CANCELLED', 'REJECTED'],
    default: 'PENDING',
  })
  status: PaymentStatusEnum;

  @Prop({ required: true, enum: ['ORDERS', 'OTHER'], default: 'ORDERS' })
  module: PaymentModuleEnum;

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ required: true, default: 0 })
  discount: number;

  @Prop({ required: true, default: 0 })
  no_products: number;

  @Prop({ type: Date })
  date_payment: Date;

  @Prop({ type: Date })
  date_cancelled: Date;

  @Prop({ type: Date })
  date_rejected: Date;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deletedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Virtual populate for webhooks
PaymentSchema.virtual('webhooks', {
  ref: 'PaymentWebhook',
  localField: '_id',
  foreignField: 'payment',
  justOne: false,
  options: { sort: { date_executed: -1 } } // Sort by execution date, newest first
});

// Indexes
PaymentSchema.index({ client: 1 });
PaymentSchema.index({ order: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ source: 1 });
PaymentSchema.index({ module: 1 });
PaymentSchema.index({ deletedAt: 1 });
PaymentSchema.index({ date_payment: 1 });
