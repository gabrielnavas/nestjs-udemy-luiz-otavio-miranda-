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

@Module({
  imports: [
    ConfigModule.forRoot(), // carregar o .env
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
      autoLoadEntities: process.env.NESTJS_AUTO_LOAD_ENTITIES === 'true',

      // sincroniza as tabelas com o banco de dados.
      // não deve ser usado em produção
      synchronize: process.env.NESTJS_SYNCHRONIZE_ORM === 'true',

      // habilita o log de queries SQL no console
      // não usar em produção
      logging: process.env.NESTJS_LOG_SQL === 'true',
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
