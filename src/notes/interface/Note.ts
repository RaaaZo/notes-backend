import { CategoriesTypes } from './Categories';

export interface NoteInterface {
  title: string;
  text: string;
  description: string;
  createDate: Date;
  category: CategoriesTypes;
}
