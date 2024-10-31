import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app/app.controller';
import appConfig from 'src/app/config/app.config';
import { AuthModule } from 'src/auth/auth.module';
import { Policy } from 'src/auth/enums/route-policies.enum';
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
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should create a user with success', async () => {
      const createPessoaDto = {
        email: 'any@email.com',
        password: '123455678',
      };
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createPessoaDto);

      expect(response.status).toBe(201);
      expect(typeof response.body === 'object').toBeTruthy();
      expect(typeof response.body.id === 'string').toBeTruthy();
      expect(typeof response.body.email === 'string').toBeTruthy();
      expect(response.body.policies).toEqual([
        Policy.user,
        Policy.findUserById,
        Policy.deleteUser,
        Policy.findAllUsers,
        Policy.findUsers,
      ]);
    });
  });
});
