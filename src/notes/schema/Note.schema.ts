import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CategoriesTypes } from '../interface/Categories';

export type NoteDocument = Note & Document;

@Schema()
export class Note {
  @Prop()
  title: string;

  @Prop()
  text: string;

  @Prop({ required: false })
  description: string;

  @Prop({ default: Date.now })
  createDate: Date;

  @Prop({ default: null })
  updatedDate: Date;

  @Prop()
  category: CategoriesTypes;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
