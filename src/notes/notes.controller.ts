import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { newNoteDto } from './dto/newNote.dto';
import { NoteInterface } from './interface/Note';
import { NotesService } from './notes.service';
import { DeleteNoteInterface } from './interface/DeleteNote';
import { UpdateNoteDto } from './dto/updateNote.dto';
import { UpdateNoteInterface } from './interface/UpdateNote';

@Controller('/notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get('/:id')
  async getNoteById(@Param('id') id: string): Promise<NoteInterface> {
    return this.notesService.getNoteById(id);
  }

  @Post('/:userId')
  async addNote(
    @Body() newNote: newNoteDto,
    @Param('userId') userId: string,
  ): Promise<NoteInterface> {
    return this.notesService.addNote(newNote, userId);
  }

  @Delete('/:id')
  async deleteNote(@Param('id') id: string): Promise<DeleteNoteInterface> {
    return this.notesService.deleteNote(id);
  }

  @Put('/:id')
  async updateNote(
    @Body() updatedNote: UpdateNoteDto,
    @Param('id') id: string,
  ): Promise<UpdateNoteInterface> {
    return this.notesService.updateNote(updatedNote, id);
  }
}
