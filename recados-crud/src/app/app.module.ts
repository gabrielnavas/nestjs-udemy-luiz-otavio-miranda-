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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',

      // deve ser usado o .env
      host: 'localhost',
      port: 5432,
      database: 'postgres',
      username: 'postgres',
      password: 'postgres123',

      // carrega entidades sem precisar especifica-las
      // não precisa especificar as entidades no app module
      autoLoadEntities: true,

      // sincroniza as tabelas com o banco de dados.
      // não deve ser usado em produção
      synchronize: true,

      // habilita o log de queries SQL no console
      // não usar em produção
      logging: true,
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
