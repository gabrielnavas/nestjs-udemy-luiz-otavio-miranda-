import { Global, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';

@Global()
@Module({
  imports: [UsersModule, ConfigModule.forFeature(jwtConfig)],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useClass: AuthService,
    },
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
  exports: [HashingService],
})
export class AuthModule {}
