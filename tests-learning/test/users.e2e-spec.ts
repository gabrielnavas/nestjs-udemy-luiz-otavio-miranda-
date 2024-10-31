import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
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
        password: '12345678',
      };
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createPessoaDto);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(expect.any(Object));
      expect(response.body.id).toEqual(expect.any(String));
      expect(response.body.email).toEqual(expect.any(String));
      expect(response.body.policies).toEqual([
        Policy.user,
        Policy.findUserById,
        Policy.deleteUser,
        Policy.findAllUsers,
        Policy.findUsers,
      ]);
    });

    it('should throws an error', async () => {
      //  Arrange
      const params = [
        {
          data: {
            email: 'any@',
            password: '12345678',
          },
          error: {
            error: 'Bad Request',
            message: ['E-mail está inválido.'],
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
        {
          data: {
            email: 'any@email.com',
            password: '1234567',
          },
          error: {
            error: 'Bad Request',
            message: ['A senha deve ter no mínimo 8 caracteres.'],
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
        {
          data: {
            email: 'any@email.com',
            password: new Array(71)
              .fill('')
              .map(() => 'a')
              .join(''),
          },
          error: {
            error: 'Bad Request',
            message: ['A senha deve ter no máximo 70 caracteres.'],
            statusCode: HttpStatus.BAD_REQUEST,
          },
        },
      ];

      //  Act & Assert 
      const promises = params.map(async (param) => {
        const response = await request(app.getHttpServer())
          .post('/users')
          .send(param.data);

        expect(response.body).toEqual(param.error);
        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
      await Promise.all(promises);
    });
  });
});
