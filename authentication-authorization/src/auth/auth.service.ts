import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dtos/sigin.dto';
import { HashingService } from './hashing/hashing.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    console.log(jwtConfiguration);
  }

  async signIn(dto: SignInDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    const isValidPassword = await this.hashingService.compare(
      dto.password,
      user.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('E-mail/Password incorrect.');
    }
    return '123';
  }
}
