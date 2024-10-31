import { INestApplication, ValidationPipe } from '@nestjs/common';

export default (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
};
