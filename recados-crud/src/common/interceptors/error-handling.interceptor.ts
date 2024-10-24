import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        // pega qualquer tipo de erro
        console.log(err.message);
        return throwError(() => {
          // modifico o erro
          if (err instanceof NotFoundException) {
            return new NotFoundException(err.message);
          }
          if (err instanceof ConflictException) {
            return new BadRequestException(err.message);
          } else {
            return new InternalServerErrorException(
              'Houve um problema. Tente novamente mais tarde.',
            );
          }
        });
      }),
    );
  }
}
