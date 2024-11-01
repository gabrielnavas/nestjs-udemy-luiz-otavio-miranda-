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

  describe('/users/:id (GET)', () => {
    it('should return unautorized', async () => {
      await request(app.getHttpServer()).get('/users/1').expect(401).expect({
        message: 'Missing token',
        error: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return an user', async () => {
      // Arrive
      const createPessoaDto = {
        email: 'any@email.com',
        password: '12345678',
      };
      const signInDto = {
        email: createPessoaDto.email,
        password: createPessoaDto.password,
      };

      // Act
      const createUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createPessoaDto);
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto);

      const response = await request(app.getHttpServer())
        .get(`/users/${createUserResponse.body.id}`)
        .set('Authorization', `Bearer ${signInResponse.body.accessToken}`);

      // Assert
      expect(response.status).toBe(HttpStatus.OK);
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
  });

  describe('/users (GET)', () => {
    it('should return unautorized', async () => {
      await request(app.getHttpServer()).get('/users').expect(401).expect({
        message: 'Missing token',
        error: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should return users', async () => {
      // Arrange
      const usersCreatedLength = 10;
      const createPessoaDtos = new Array(usersCreatedLength)
        .fill('')
        .map((_, index) => ({
          email: `any${index}@email.com`,
          password: '12345678',
        }));
      const signInDto = {
        email: createPessoaDtos[0].email,
        password: createPessoaDtos[0].password,
      };

      // Act
      for (let i = 0; i < usersCreatedLength; i++) {
        await request(app.getHttpServer())
          .post('/users')
          .send(createPessoaDtos[i]);
      }

      const signInResponse = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signInDto);

      const response = await request(app.getHttpServer())
        .get(`/users?page=1&size=${usersCreatedLength}`)
        .set('Authorization', `Bearer ${signInResponse.body.accessToken}`);

      // Assert
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(expect.any(Object));
      expect(response.body.length).toEqual(usersCreatedLength);
      expect(response.body[0].id).toEqual(expect.any(String));
      expect(response.body[0].email).toEqual(expect.any(String));
      expect(response.body[0].policies).toEqual([
        Policy.user,
        Policy.findUserById,
        Policy.deleteUser,
        Policy.findAllUsers,
        Policy.findUsers,
      ]);
    });
  });
});
