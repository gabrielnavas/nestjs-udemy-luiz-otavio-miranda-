import { UsersService } from 'src/users/users.service';
import { SignInDto, SignInResultDto } from './dtos/sigin.dto';
import { HashingService } from './hashing/hashing.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashingService: HashingService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto): Promise<SignInResultDto> {
    const pessoa = await this.userService.findUserByEmail(dto.email);
    const isValidPassword = await this.hashingService.compare(
      dto.password,
      pessoa.passwordHash,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('E-mail/Password incorrect.');
    }

    const accessToken = await this.jwtService.signAsync(
      {
        sub: pessoa.id,
        email: pessoa.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
      },
    );
    return {
      accessToken,
    };
  }
}
