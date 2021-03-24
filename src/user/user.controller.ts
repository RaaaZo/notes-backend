import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(@Req() req: { user: { email: string } }) {
    return this.userService.userData(req.user.email);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async loginUser(@Req() req): Promise<Express.User> {
    return this.authService.login(req.user._doc);
  }

  @Post('/register')
  async createUser(@Body() user: CreateUserDto): Promise<any> {
    return this.userService.createUser(user);
  }
}
