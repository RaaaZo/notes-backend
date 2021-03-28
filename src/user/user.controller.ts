import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { ChangeEmailDto } from './dto/changeEmail.dto';
import { ChangeUsernameDto } from './dto/changeUsername.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { ChangeEmailInterface } from './interface/changeEmail';
import { ChangeUsernameInterface } from './interface/changeUsername';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/')
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

  @UseGuards(AuthGuard('jwt'))
  @Patch('/username')
  async changeUsername(
    @Body() userData: ChangeUsernameDto,
  ): Promise<ChangeUsernameInterface> {
    return this.userService.changeUsername(userData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('/email')
  async changeEmail(
    @Body() userData: ChangeEmailDto,
  ): Promise<ChangeEmailInterface> {
    return this.userService.changeEmail(userData);
  }
}
