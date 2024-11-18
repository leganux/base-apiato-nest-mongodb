import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ShippmentWebhookDocument = ShippmentWebhook & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class ShippmentWebhook {
  @Prop({ type: MongooseSchema.Types.Mixed })
  json: any;

  @Prop()
  date_executed: Date;
}

export const PaymentWebhookSchema =
  SchemaFactory.createForClass(ShippmentWebhook);
