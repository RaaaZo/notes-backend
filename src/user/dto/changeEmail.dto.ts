import { IsEmail, IsString } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail()
  email: string;

  @IsEmail()
  newEmail: string;

  @IsString()
  password: string;
}
