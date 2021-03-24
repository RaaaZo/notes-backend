import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from 'src/notes/schema/Note.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserInterface } from './interface/createUser';
import { LoginUserInterface } from './interface/loginUser';
import { UserInterface } from './interface/user';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
      _id: user._id,
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
}
