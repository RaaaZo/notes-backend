import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { LoginUserInterface } from './interface/loginUser';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async loginUser(
    @Body() { email }: LoginUserDto,
  ): Promise<LoginUserInterface> {
    return this.userService.userData(email);
  }

  @Post('/register')
  async createUser(@Body() user: CreateUserDto): Promise<any> {
    return this.userService.createUser(user);
  }
}
