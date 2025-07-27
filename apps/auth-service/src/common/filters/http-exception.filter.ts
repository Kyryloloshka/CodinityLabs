import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../interfaces/error.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: ApiErrorResponse;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        // Якщо це наш кастомний виняток з структурованою відповіддю
        const responseObj = exceptionResponse as Record<string, unknown>;
        errorResponse = {
          success: false,
          error: {
            statusCode: status,
            message: (responseObj.message as string) || exception.message,
            error: (responseObj.error as string) || 'HTTP_EXCEPTION',
            timestamp: new Date().toISOString(),
            path: request.url,
            details: responseObj.details as Record<string, unknown>,
          },
        };
      } else {
        // Стандартний HttpException
        errorResponse = {
          success: false,
          error: {
            statusCode: status,
            message: exception.message,
            error: 'HTTP_EXCEPTION',
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        };
      }
    } else {
      // Неочікувана помилка
      const error =
        exception instanceof Error ? exception : new Error('Unknown error');

      errorResponse = {
        success: false,
        error: {
          statusCode: status,
          message: 'Внутрішня помилка сервера',
          error: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString(),
          path: request.url,
          details: {
            originalError: error.message,
          },
        },
      };

      // Логуємо неочікувані помилки
      this.logger.error(
        `Unhandled exception: ${error.message}`,
        error.stack,
        'HttpExceptionFilter',
      );
    }

    // Логуємо всі помилки
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${errorResponse.error.message}`,
    );

    response.status(status).json(errorResponse);
  }
}
