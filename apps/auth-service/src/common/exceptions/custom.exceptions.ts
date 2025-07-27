import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../interfaces/error.interface';

export class UserNotFoundException extends HttpException {
  constructor(userId: string) {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Користувача з ID ${userId} не знайдено`,
        error: ErrorCode.USER_NOT_FOUND,
        timestamp: new Date().toISOString(),
        path: '/users',
        details: { userId },
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Користувач з email ${email} вже існує`,
        error: ErrorCode.USER_ALREADY_EXISTS,
        timestamp: new Date().toISOString(),
        path: '/users',
        details: { email },
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class DatabaseException extends HttpException {
  constructor(operation: string, originalError?: unknown) {
    const errorMessage =
      originalError &&
      typeof originalError === 'object' &&
      'message' in originalError
        ? String(originalError.message)
        : 'Unknown error';

    super(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Помилка бази даних при виконанні операції: ${operation}`,
        error: ErrorCode.DATABASE_ERROR,
        timestamp: new Date().toISOString(),
        path: '/users',
        details: { operation, originalError: errorMessage },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(errors: any[]) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Помилка валідації даних',
        error: ErrorCode.VALIDATION_ERROR,
        timestamp: new Date().toISOString(),
        path: '/users',
        details: { validationErrors: errors },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
