import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { CategoriesTypes } from '../interface/Categories';

export type NoteDocument = Note & mongoose.Document;

@Schema()
export class Note {
  @Prop({ required: true, maxlength: 100, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  text: string;

  @Prop({ required: false, maxlength: 500, trim: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: User;

  @Prop({ default: Date.now })
  createDate: Date;

  @Prop({ default: null })
  updatedDate: Date;

  @Prop({ required: true })
  category: CategoriesTypes;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
