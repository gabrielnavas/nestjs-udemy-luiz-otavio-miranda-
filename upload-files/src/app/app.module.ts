import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    SharedModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'pictures'),
      serveRoot: '/pictures',
    }),
  ],
})
export class AppModule {}
