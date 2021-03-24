import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NextFunction } from 'express';
import * as mongoose from 'mongoose';
import { Note } from 'src/notes/schema/Note.schema';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true, maxlength: 50 })
  username: string;

  @Prop({ unique: true, required: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    required: true,
  })
  notes: Note[];

  @Prop({ default: Date.now })
  createDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next: NextFunction) {
  if (this.isModified('hashedPassword')) {
    const salt = await bcrypt.genSalt();
    this.hashedPassword = await bcrypt.hash(this.hashedPassword, salt);
    next();
  } else {
    next();
  }
});
