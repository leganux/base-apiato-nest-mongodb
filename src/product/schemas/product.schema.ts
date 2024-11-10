import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum ProductCategoryEnum {
  ARTS = 'arts',
  PHARMACY = 'pharmacy',
  FOOD = 'food',
  LIQUOR = 'liquor',
}

export type ProductDocument = Product & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Product {
  @Prop({ required: true })
  product: string;

  @Prop()
  image: string;

  @Prop({ required: true, default: 0 })
  stock: string;

  @Prop({ required: true, enum: ['arts', 'pharmacy', 'food', 'liquor'], default: "arts" })
  category: ProductCategoryEnum;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  brand: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);