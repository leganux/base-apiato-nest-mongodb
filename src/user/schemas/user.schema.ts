import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRoleInterface } from '../interfaces/user.interface';
import { UserAddress } from './user-address.schema';

export type UserDocument = User & Document;

@Schema({ 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  picture?: string;

  @Prop()
  bornDate: Date;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop()
  timezone: string;

  @Prop()
  isVerified: boolean;

  @Prop()
  verificationToken?: string;

  @Prop({
    default: UserRoleInterface.USER,
  })
  role?: UserRoleInterface;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Virtual populate for addresses
UserSchema.virtual('addresses', {
  ref: 'UserAddress',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
  options: { sort: { is_default: -1 } } // Sort by default address first
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 });
UserSchema.index({ deletedAt: 1 });
