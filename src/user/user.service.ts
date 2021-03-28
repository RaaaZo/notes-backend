import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { Note } from 'src/notes/schema/Note.schema';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { ChangeUsernameDto } from './dto/changeUsername.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ChangeEmailInterface } from './interface/changeEmail';
import { ChangeUsernameInterface } from './interface/changeUsername';
import { CreateUserInterface } from './interface/createUser';
import { LoginUserInterface } from './interface/loginUser';
import { UserInterface } from './interface/user';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async addNoteToUser(userId: string, noteId: Note): Promise<void> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new HttpException(
        'User with provided credentials not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    user.notes.push(noteId);
    await user.save();
  }

  async findUser(email: string): Promise<UserInterface> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException(
        'User with provided email not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async userData(email: string): Promise<LoginUserInterface> {
    const user = await this.userModel
      .findOne({ email }, '-hashedPassword')
      .populate('notes', '-_id');

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      notes: user.notes,
      createDate: user.createDate,
    };
  }

  async createUser(user: CreateUserDto): Promise<CreateUserInterface> {
    if (user.password.length < 6) {
      throw new HttpException(
        'Your password have to be at least 6 characters',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.password !== user.confirmedPassword) {
      throw new HttpException(`Passwords do not match`, HttpStatus.CONFLICT);
    }

    const emailExists = await this.userModel.findOne({ email: user.email });

    if (emailExists) {
      throw new HttpException('Email is already used', HttpStatus.FORBIDDEN);
    }

    const newUser = await this.userModel.create({
      username: user.username,
      hashedPassword: user.password,
      email: user.email,
    });

    return {
      email: newUser.email,
      message: 'User successfully created.',
    };
  }

  async changeUsername(
    userData: ChangeUsernameDto,
  ): Promise<ChangeUsernameInterface> {
    const user = (await this.findUser(userData.email)) as UserDocument;

    await this.authService.validateUser(user.email, userData.password);

    try {
      if (user.username !== userData.username) {
        user.username = userData.username;
        await user.save();

        return {
          message:
            'Username successfully changed. You have to sign in again due to username change.',
          success: true,
        };
      } else {
        return {
          message: 'New username is the same as the old one',
          success: false,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Try again!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeEmail(userData: ChangeEmailDto): Promise<ChangeEmailInterface> {
    const user = (await this.findUser(userData.email)) as UserDocument;

    const userWithProvidedEmailExists = await this.userModel.findOne({
      email: userData.newEmail,
    });

    if (userWithProvidedEmailExists) {
      throw new HttpException(
        'Provided new email is already used by another user',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.authService.validateUser(user.email, userData.password);

    try {
      if (user.email !== userData.newEmail) {
        user.email = userData.newEmail;
        await user.save();

        return {
          message:
            'Email successfully changed. You have to sign in with new email.',
          success: true,
        };
      } else {
        return {
          message: 'New email is the same as the old one',
          success: false,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Something went wrong. Try again!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
