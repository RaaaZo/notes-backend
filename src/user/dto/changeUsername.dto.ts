import { IsEmail, IsString } from 'class-validator';

export class ChangeUsernameDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
