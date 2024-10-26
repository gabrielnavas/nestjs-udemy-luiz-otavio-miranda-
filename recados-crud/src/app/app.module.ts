import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecadosModule } from 'src/recados/recados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { SimpleMiddleware } from 'src/common/middlewares/simple.middlewares';
import { AnotherMiddleware } from 'src/common/middlewares/another.middlewares';
import { APP_GUARD } from '@nestjs/core';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { ConfigModule } from '@nestjs/config';

import * as Joi from 'joi'

@Module({
  imports: [
    // carregar o .env padrão
    ConfigModule.forRoot({
      // envFilePath: ['.env', 'otherDirectory.env']
      validationSchema: Joi.object({
        DATABASE_TYPE: Joi.required(),

        PG_HOST: Joi.required(),
        PG_PORT: Joi.number().min(0),
        PG_DATABASE: Joi.required(),
        PG_USERNAME: Joi.required(),
        PG_PASSWORD: Joi.required(),

        NESTJS_AUTO_LOAD_ENTITIES: Joi.number().min(0).default(0),
        NESTJS_SYNCHRONIZE_ORM: Joi.number().min(0).default(0),
        NESTJS_LOG_SQL: Joi.number().min(0).default(0),
      }),
    }),

    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,

      // deve ser usado o .env
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      database: process.env.PG_DATABASE,
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,

      // carrega entidades sem precisar especifica-las
      // não precisa especificar as entidades no app module
      autoLoadEntities: Boolean(process.env.NESTJS_AUTO_LOAD_ENTITIES),

      // sincroniza as tabelas com o banco de dados.
      // não deve ser usado em produção
      synchronize: Boolean(process.env.NESTJS_SYNCHRONIZE_ORM),

      // habilita o log de queries SQL no console
      // não usar em produção
      logging: Boolean(process.env.NESTJS_LOG_SQL),
    }),
    PessoasModule,
    RecadosModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: IsAdminGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleMiddleware, AnotherMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
