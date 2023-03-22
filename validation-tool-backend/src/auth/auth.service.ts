import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // const user = await this.usersService.findOne(email);
    const user = await this.usersService.loginUserByEmail(email, pass);
    console.log(user);
    // if (user && user.password === pass) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    return user;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      privileges: user.privileges,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
