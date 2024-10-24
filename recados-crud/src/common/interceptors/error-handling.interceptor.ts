import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

export class ErrorHandlingInterceptior implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        // pega qualquer tipo de erro
        console.log(err.message);
        return throwError(() => err)
      }),
    );
  }
}
