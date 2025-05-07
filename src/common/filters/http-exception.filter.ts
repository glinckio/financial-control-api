import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | null;
  error?: string;
}

interface ExceptionResponse {
  message: string;
  error?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() as HttpStatus;
    const exceptionResponse = exception.getResponse();

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as ExceptionResponse).message || null,
      error:
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as ExceptionResponse).error
          : undefined,
    };

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.error = 'Internal server error';
    }

    response.status(status).json(errorResponse);
  }
}
