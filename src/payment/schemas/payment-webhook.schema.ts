import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentSourceEnum } from '../interfaces/payment.interface';

export type PaymentWebhookDocument = PaymentWebhook & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class PaymentWebhook {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Payment'
  })
  payment: MongooseSchema.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['CASH', 'OP_CARD', 'OP_SPEI', 'OP_STORE', 'MP_GENERAL'],
    default: 'CASH',
  })
  source: PaymentSourceEnum;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
    validate: {
      validator: function (v: any) {
        return v !== null && typeof v === 'object';
      },
      message: 'JSON data must be a valid object'
    }
  })
  json: Record<string, any>;

  @Prop({ required: true, default: Date.now })
  date_executed: Date;
}

export const PaymentWebhookSchema = SchemaFactory.createForClass(PaymentWebhook);

// Indexes
PaymentWebhookSchema.index({ payment: 1 });
PaymentWebhookSchema.index({ source: 1 });
PaymentWebhookSchema.index({ date_executed: 1 });

// Virtual for accessing the related payment
PaymentWebhookSchema.virtual('paymentDetails', {
  ref: 'Payment',
  localField: 'payment',
  foreignField: '_id',
  justOne: true
});
