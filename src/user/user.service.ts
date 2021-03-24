import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: CreateUserDto): Promise<any> {
    if (user.password !== user.confirmedPassword) {
      throw new HttpException(`Password doesn't match`, HttpStatus.CONFLICT);
    }

    const emailExists = await this.userModel.findOne({ email: user.email });

    if (emailExists) {
      throw new HttpException('Email is already used', HttpStatus.FORBIDDEN);
    }
  }
}
