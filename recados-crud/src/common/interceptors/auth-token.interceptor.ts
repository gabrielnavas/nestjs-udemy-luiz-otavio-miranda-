import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      // verificar o token
      // if(token === '123') {
      //   ...
      // } else {
      // throw new UnauthorizedException('Usuário não logado');
      // }
      console.log(token);
    }
    return next.handle();
  }
}
