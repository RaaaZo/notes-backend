import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Note } from 'src/notes/schema/Note.schema';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  hashedPassword: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }] })
  notes: Note[];

  @Prop({ default: Date.now })
  createDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
