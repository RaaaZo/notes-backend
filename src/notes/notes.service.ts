import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { newNoteDto } from './dto/newNote.dto';
import { UpdateNoteDto } from './dto/updateNote.dto';
import { DeleteNoteInterface } from './interface/DeleteNote';
import { NoteInterface } from './interface/Note';
import { UpdateNoteInterface } from './interface/UpdateNote';
import { Note, NoteDocument } from './schema/Note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async getNoteById(id: string): Promise<NoteInterface> {
    if (id.length !== 24) {
      throw new HttpException('Woops! Something went wrong. Try again!', 500);
    }

    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new HttpException('Could not find that note.', 404);
    }

    return note;
  }

  async addNote(newNote: newNoteDto): Promise<NoteInterface> {
    const addNote = new this.noteModel(newNote);
    await addNote.save();

    return addNote;
  }

  async deleteNote(id: string): Promise<DeleteNoteInterface> {
    if (id.length !== 24) {
      throw new HttpException('Woops! Something went wrong. Try again!', 500);
    }

    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new HttpException('Could not find that note.', 404);
    }

    await note.delete();

    return {
      message: 'Note successfully deleted.',
    };
  }

  async updateNote(
    updatedNote: UpdateNoteDto,
    id: string,
  ): Promise<UpdateNoteInterface> {
    if (id.length !== 24) {
      throw new HttpException('Woops! Something went wrong. Try again!', 500);
    }

    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new HttpException('Could not find that note.', 404);
    }

    await note.updateOne(updatedNote);
    note.updatedDate = new Date();

    note.save();

    return {
      message: 'Note successfully updated.',
    };
  }
}
