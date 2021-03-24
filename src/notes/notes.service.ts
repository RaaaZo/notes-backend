import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { newNoteDto } from './dto/newNote.dto';
import { UpdateNoteDto } from './dto/updateNote.dto';
import { DeleteNoteInterface } from './interface/DeleteNote';
import { NoteInterface } from './interface/Note';
import { UpdateNoteInterface } from './interface/UpdateNote';
import { Note, NoteDocument } from './schema/Note.schema';

@Injectable()
export class NotesService {
  constructor(
    private userService: UserService,
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
  ) {}

  async getNoteById(id: string): Promise<NoteInterface> {
    if (id.length !== 24) {
      throw new HttpException(
        'Woops! Something went wrong. Try again!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new HttpException(
        'Could not find that note.',
        HttpStatus.NOT_FOUND,
      );
    }

    return note;
  }

  async addNote(newNote: newNoteDto, userId: string): Promise<NoteInterface> {
    const note = await this.noteModel.create({
      title: newNote.title,
      description: newNote.description,
      text: newNote.text,
      owner: userId,
      category: newNote.category,
    });

    await this.userService.addNoteToUser(userId, note._id);

    return note;
  }

  async deleteNote(id: string): Promise<DeleteNoteInterface> {
    if (id.length !== 24) {
      throw new HttpException(
        'Woops! Something went wrong. Try again!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new HttpException(
        'Could not find that note.',
        HttpStatus.NOT_FOUND,
      );
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
      throw new HttpException(
        'Woops! Something went wrong. Try again!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const note = await this.noteModel.findById(id).exec();

    if (!note) {
      throw new HttpException(
        'Could not find that note.',
        HttpStatus.NOT_FOUND,
      );
    }

    await note.updateOne(updatedNote);
    note.updatedDate = new Date();

    note.save();

    return {
      message: 'Note successfully updated.',
      note: note,
    };
  }
}
