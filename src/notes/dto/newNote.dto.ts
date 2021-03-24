import { IsIn, IsOptional, IsString } from 'class-validator';
import { CategoriesTypes } from '../interface/Categories';
import { NoteInterface } from '../interface/Note';

export class newNoteDto implements NoteInterface {
  createDate: Date;
  @IsString()
  title: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsIn(['Education', 'Sport', 'New Technologies', 'Cars'])
  category: CategoriesTypes;
}
