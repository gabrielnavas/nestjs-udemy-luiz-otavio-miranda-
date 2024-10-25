import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class SimpleMiddleware implements NestMiddleware {
  use = (req: Request, res: Response, next: NextFunction) => {
    console.log('sou um SimpleMiddleware');
    const user = {
      id: '1',
      name: 'John',
    };
    req['user'] = user;
    
    // chama o próximo middleware
    next();

    console.log('SimpleMiddleware: Depois do next()');

    res.on('finish', () => {
      console.log('SimpleMiddleware: Terminou');
      
    })
    
  };
}
