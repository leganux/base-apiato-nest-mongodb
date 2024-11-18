import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BillConfigDocument = BillConfig & Document;

@Schema({ 
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  collection: 'bill_configs'
})
export class BillConfig {
  @Prop({ required: true, default: true })
  is_development: boolean;

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  sandbox: {
    base_url: string;
    username: string;
    password: string;
  };

  @Prop({ required: true, type: MongooseSchema.Types.Mixed })
  production: {
    base_url: string;
    username: string;
    password: string;
  };

  @Prop({ required: true, default: true })
  is_active: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed })
  default_settings?: {
    serie?: string;
    expedition_place?: string;
    currency?: string;
  };

  @Prop({ type: [String], default: [] })
  allowed_rfcs: string[];

  @Prop({ type: MongooseSchema.Types.Date })
  last_sync?: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata?: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Date, default: null })
  deleted_at?: Date;
}

export const BillConfigSchema = SchemaFactory.createForClass(BillConfig);

// Ensure only one active config exists
BillConfigSchema.index(
  { is_active: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { 
      is_active: true,
      deleted_at: null 
    } 
  }
);

// Default configuration
export const defaultBillConfig: Partial<BillConfig> = {
  is_development: true,
  sandbox: {
    base_url: 'https://apisandbox.facturama.mx',
    username: '',
    password: ''
  },
  production: {
    base_url: 'https://api.facturama.mx',
    username: '',
    password: ''
  },
  is_active: true,
  default_settings: {
    serie: 'A',
    expedition_place: '64000',
    currency: 'MXN'
  },
  allowed_rfcs: []
};
