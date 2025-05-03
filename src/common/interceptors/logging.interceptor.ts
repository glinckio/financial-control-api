import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const now = Date.now();

    this.logger.log(`Request: ${method} ${url}`, 'LoggingInterceptor');

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const { statusCode } = response;
          const responseTime = Date.now() - now;

          this.logger.log(
            `Response: ${method} ${url} ${statusCode} ${responseTime}ms`,
            'LoggingInterceptor',
          );
        },
        error: (error: Error & { status?: number }) => {
          const responseTime = Date.now() - now;
          this.logger.error(
            `${method} ${url} ${error.status || 500} ${responseTime}ms`,
            error.stack || '',
            'LoggingInterceptor',
          );
        },
      }),
    );
  }
}
