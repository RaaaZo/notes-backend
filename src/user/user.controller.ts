import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  async createUser(@Body() user: CreateUserDto): Promise<any> {
    return this.userService.createUser(user);
  }
}