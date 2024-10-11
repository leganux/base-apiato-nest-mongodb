import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class File extends Document {
  @Prop({ required: true })
  localPath: string;

  @Prop({ required: true })
  publicPath: string;

  @Prop({ required: true })
  filename: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
