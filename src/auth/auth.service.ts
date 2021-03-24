import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUser(email);

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      throw new HttpException('Invalid credentials.', HttpStatus.UNAUTHORIZED);
    }

    if (user && passwordMatch) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }
}
