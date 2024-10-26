import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dtos/sigin.dto';
import { AuthService } from './auth.service';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() dto: SignInDto) {
    const token = await this.authService.signIn(dto);
    return {
      token,
    };
  }
}
