import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use = (req: Request, res: Response, next: NextFunction) => {
    console.log('sou um simple middleware');
    const user = {
      id: '1',
      name: 'John',
    };
    req['user'] = user;
    // chama o próximo middleware
    return next();
  };
}
