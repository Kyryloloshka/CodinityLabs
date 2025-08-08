import { ApiProperty } from '@nestjs/swagger';
import { ErrorDetails } from '../types';

export class ApiSuccessResponseDto<T = unknown> {
  @ApiProperty({
    description: 'Статус успішності операції',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Дані відповіді',
  })
  data: T;

  @ApiProperty({
    description: 'Повідомлення про успіх',
    example: 'Operation completed successfully',
  })
  message: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({
    description: 'Статус успішності операції',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'Код помилки',
    example: 'VALIDATION_ERROR',
  })
  error: ErrorDetails;

  @ApiProperty({
    description: 'HTTP статус код',
    example: 400,
  })
  statusCode: number;
}
