import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app/app.controller';
import appConfig from 'src/app/config/app.config';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), AuthModule, UsersModule],
      controllers: [AppController],
    }).compile();

    app = module.createNestApplication();
    appConfig(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close()
  });

  it('/users (POST)', async () => {});
});
