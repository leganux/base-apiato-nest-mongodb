import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  ShippingCarrierEnum,
  ShippingModuleEnum,
  ShippingStatusEnum,
  ShippingTypeEnum,
} from '../interfaces/shipping.interface';

export type ShippingDocument = Shipping & Document;

@Schema({ timestamps: true })
class WebhookData {
  @Prop({ required: true })
  status: string;

  @Prop()
  status_detail: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  raw_data: any;
}

const WebhookDataSchema = SchemaFactory.createForClass(WebhookData);

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Shipping {
  @Prop({
    required: true,
    enum: Object.values(ShippingCarrierEnum),
    default: ShippingCarrierEnum.DHL,
  })
  carrier: ShippingCarrierEnum;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  client: MongooseSchema.Types.ObjectId;

  @Prop({ type: [WebhookDataSchema], default: [] })
  webhooks: WebhookData[];

  @Prop({
    required: true,
    enum: Object.values(ShippingStatusEnum),
    default: ShippingStatusEnum.PENDING,
  })
  status: ShippingStatusEnum;

  @Prop({ required: true, enum: Object.values(ShippingModuleEnum), default: ShippingModuleEnum.ORDERS })
  module: ShippingModuleEnum;

  @Prop({ required: true, enum: Object.values(ShippingTypeEnum), default: ShippingTypeEnum.BOX })
  type: ShippingTypeEnum;

  @Prop({ required: true, default: 0 })
  total: number;

  @Prop({ required: true, default: 0 })
  no_products: number;

  @Prop()
  tracking_number: string;

  @Prop()
  label_url: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  origin: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed })
  destination: Record<string, any>;

  @Prop({ type: [MongooseSchema.Types.Mixed] })
  packages: Record<string, any>[];

  @Prop()
  date_quoted: Date;

  @Prop()
  date_labeled: Date;

  @Prop()
  date_picked_up: Date;

  @Prop()
  date_tracked: Date;

  @Prop()
  date_delivered: Date;

  @Prop()
  date_cancelled: Date;

  @Prop()
  date_rejected: Date;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deletedAt: Date;
}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);

// Indexes
ShippingSchema.index({ tracking_number: 1 });
ShippingSchema.index({ status: 1 });
ShippingSchema.index({ carrier: 1 });
ShippingSchema.index({ client: 1 });
