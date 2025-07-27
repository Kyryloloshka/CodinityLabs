import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user.dto';

export class ApiSuccessResponseDto<T> {
  @ApiProperty({
    description: 'Статус успішності операції',
    example: true,
  })
  success: true;

  @ApiProperty({
    description: 'Дані відповіді',
  })
  data: T;

  @ApiProperty({
    description: 'Повідомлення про успіх',
    example: 'Операція виконана успішно',
    required: false,
  })
  message?: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({
    description: 'Статус успішності операції',
    example: false,
  })
  success: false;

  @ApiProperty({
    description: 'Інформація про помилку',
    type: 'object',
    properties: {
      statusCode: { type: 'number', example: 400 },
      message: { type: 'string', example: 'Помилка валідації' },
      error: { type: 'string', example: 'VALIDATION_ERROR' },
      timestamp: { type: 'string', example: '2025-07-27T11:00:31.909Z' },
      path: { type: 'string', example: '/users' },
      details: { type: 'object', additionalProperties: true, example: {} },
    },
  })
  error: {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
    path: string;
    details?: Record<string, any>;
  };
}

export class UserSuccessResponseDto extends ApiSuccessResponseDto<UserResponseDto> {}
export class UsersListSuccessResponseDto extends ApiSuccessResponseDto<
  UserResponseDto[]
> {}
