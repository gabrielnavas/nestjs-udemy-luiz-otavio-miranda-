import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class TimingConnectionInterceptior implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<any> {
    // executa antes dos requests
    const startTime = Date.now();
    console.log('TimingConnectionInterceptor executado: ANTES');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    return next.handle().pipe(
      tap(data => {
        // executa após o request
        const finalTime = Date.now();
        const elapsedTime = finalTime - startTime;
        console.log(
          `TimingConnectionInterceptor executado: DEPOIS. Levou ${elapsedTime}ms para executar`,
        );

        // data é o body de resposta
        console.log(data);
      }),
    );
  }
}
