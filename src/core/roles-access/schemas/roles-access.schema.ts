import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
class RoleAccess {
  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  method: string;

  @Prop({ type: [String], required: true })
  roles: string[];
}

@Schema({ timestamps: true })
class ConfigItem {
  @Prop({ type: [RoleAccess], required: true })
  routes: RoleAccess[];
}

@Schema({ timestamps: true })
export class RolesAccess extends Document {
  @Prop({ required: true })
  module: string;

  @Prop({ type: ConfigItem, required: true })
  config: ConfigItem;
}

export const RolesAccessSchema = SchemaFactory.createForClass(RolesAccess);
