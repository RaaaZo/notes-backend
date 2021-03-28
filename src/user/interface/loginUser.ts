import { Note } from 'src/notes/schema/Note.schema';

export interface LoginUserInterface {
  id: string;
  username: string;
  email: string;
  notes: Note[];
  createDate: Date;
}
