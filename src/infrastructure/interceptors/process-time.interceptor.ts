import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - request.startTime;
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-Response-Time', `${duration}ms`);
      })
    );
  }
}