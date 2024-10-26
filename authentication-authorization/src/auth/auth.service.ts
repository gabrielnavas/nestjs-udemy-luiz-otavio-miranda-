import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sigin.dto';
import { HashingService } from './hashing/hashing.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(dto: SignInDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    const isValidPassword = await this.hashingService.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new Error('E-mail/Password incorrect.');
    }
    return '123';
  }
}
