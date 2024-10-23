import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove valores {chave:valor} que não estão no DTO num Post, Patch ou put por exemplo.
      forbidNonWhitelisted: true, // lançar error quando {chave:valor} não existir no body
      transform: false, // transformar os valores do body em tipos específicos, como parametros numéricos, body entre outros
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
