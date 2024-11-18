import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ShippingRangeEnum } from '../../shipping/interfaces/shipping.interface';

export enum AddressTypeEnum {
  SHIPPING = 'shipping',
  BILLING = 'billing',
  BOTH = 'both'
}

export type UserAddressDocument = UserAddress & Document;

@Schema({ 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'user_addresses'
})
export class UserAddress {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  street: string;

  @Prop()
  street2?: string;

  @Prop({ required: true })
  exterior_number: string;

  @Prop()
  interior_number?: string;

  @Prop({ required: true })
  neighborhood: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  municipality: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  postal_code: string;

  @Prop()
  reference?: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop({ required: true, enum: Object.values(ShippingRangeEnum) })
  shipping_range: ShippingRangeEnum;

  @Prop({ enum: Object.values(AddressTypeEnum), default: AddressTypeEnum.SHIPPING })
  type: AddressTypeEnum;

  @Prop({ default: false })
  is_default: boolean;

  // Billing specific fields
  @Prop()
  rfc?: string;

  @Prop()
  business_name?: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deleted_at?: Date;
}

export const UserAddressSchema = SchemaFactory.createForClass(UserAddress);

// Indexes
UserAddressSchema.index({ user: 1 });
UserAddressSchema.index({ shipping_range: 1 });
UserAddressSchema.index({ postal_code: 1 });
UserAddressSchema.index({ type: 1 });
UserAddressSchema.index({ rfc: 1 });
UserAddressSchema.index({ deleted_at: 1 });
UserAddressSchema.index(
  { user: 1, is_default: 1, type: 1 },
  { 
    unique: true,
    partialFilterExpression: { 
      is_default: true,
      deleted_at: null 
    }
  }
);

// Make billing fields required when type is BILLING or BOTH
UserAddressSchema.pre('save', function(next) {
  if (this.type === AddressTypeEnum.BILLING || this.type === AddressTypeEnum.BOTH) {
    if (!this.rfc) {
      next(new Error('RFC is required for billing addresses'));
    }
    if (!this.business_name) {
      next(new Error('Business name is required for billing addresses'));
    }
  }
  next();
});
