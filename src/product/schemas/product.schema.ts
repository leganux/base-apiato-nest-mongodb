import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ProductStatusEnum } from '../interfaces/product.interface';

export type ProductDocument = Product & Document;

@Schema({ 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})
export class Product {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, index: true })
  sat_key: string;

  @Prop({ index: true })
  principal_key: string;

  @Prop()
  secondary_key: string;

  @Prop()
  tertiary_key: string;

  @Prop({ index: true })
  barcode: string;

  @Prop()
  QR: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ 
    required: true, 
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Brand',
    index: true 
  })
  brand: MongooseSchema.Types.ObjectId;

  @Prop({ 
    required: true, 
    enum: ProductStatusEnum, 
    default: 'not_listed',
    index: true 
  })
  status: ProductStatusEnum;

  @Prop({
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Measurement_unit' }],
    validate: {
      validator: function(v: any[]) {
        return v.length > 0;
      },
      message: 'Product must have at least one measurement unit'
    }
  })
  measurement_unit: MongooseSchema.Types.ObjectId[];

  @Prop({
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }],
    validate: {
      validator: function(v: any[]) {
        return v.length > 0;
      },
      message: 'Product must have at least one category'
    }
  })
  categories: MongooseSchema.Types.ObjectId[];

  @Prop({ 
    required: true,
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tax' }],
    validate: {
      validator: function(v: any[]) {
        return v.length > 0;
      },
      message: 'Product must have at least one tax'
    }
  })
  taxes: MongooseSchema.Types.ObjectId[];

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Supplier',
    index: true
  })
  main_supplier: MongooseSchema.Types.ObjectId;

  @Prop()
  location: string;

  @Prop({ 
    required: true, 
    default: -1,
    validate: {
      validator: function(v: number) {
        return v >= -1;
      },
      message: 'Max quantity must be greater than or equal to -1'
    }
  })
  max: number;

  @Prop({ 
    required: true, 
    default: 0,
    validate: {
      validator: function(v: number) {
        return v >= 0;
      },
      message: 'Min quantity must be greater than or equal to 0'
    }
  })
  min: number;

  @Prop({ 
    required: true, 
    default: 1,
    validate: {
      validator: function(v: number) {
        return v >= 1;
      },
      message: 'Reorder point must be greater than or equal to 1'
    }
  })
  reorder: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Discount',
    index: true
  })
  discount?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ deletedAt: 1 });

// Virtual populate configurations
ProductSchema.virtual('brandDetails', {
  ref: 'Brand',
  localField: 'brand',
  foreignField: '_id',
  justOne: true
});

ProductSchema.virtual('measurementUnitDetails', {
  ref: 'Measurement_unit',
  localField: 'measurement_unit',
  foreignField: '_id'
});

ProductSchema.virtual('categoryDetails', {
  ref: 'Category',
  localField: 'categories',
  foreignField: '_id'
});

ProductSchema.virtual('taxDetails', {
  ref: 'Tax',
  localField: 'taxes',
  foreignField: '_id'
});

ProductSchema.virtual('supplierDetails', {
  ref: 'Supplier',
  localField: 'main_supplier',
  foreignField: '_id',
  justOne: true
});

ProductSchema.virtual('discountDetails', {
  ref: 'Discount',
  localField: 'discount',
  foreignField: '_id',
  justOne: true
});
