import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SubmissionDto {
  @ApiProperty({
    description: 'Унікальний ідентифікатор подання',
    example: '89d47645-d28e-480c-8de7-a41b556fa93c',
  })
  id: string;

  @ApiProperty({
    description: 'ID користувача',
    example: 'user123',
  })
  userId: string;

  @ApiProperty({
    description: 'ID завдання',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  assignmentId: string;

  @ApiProperty({
    description: 'Код рішення',
    example:
      'function factorial(n) {\n  if (n === 0 || n === 1) return 1;\n  return n * factorial(n - 1);\n}',
  })
  code: string;

  @ApiProperty({
    description: 'Мова програмування',
    example: 'javascript',
    required: false,
  })
  language?: string;

  @ApiProperty({
    description: 'Звіт ESLint',
    example: null,
    required: false,
  })
  eslintReport: any;

  @ApiProperty({
    description: 'Результати тестів',
    example: null,
    required: false,
  })
  testResults: any;

  @ApiProperty({
    description: 'Оцінка',
    example: null,
    required: false,
  })
  score: number;

  @ApiProperty({
    description: 'Статус подання',
    example: 'PENDING',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
  })
  status: string;

  @ApiProperty({
    description: 'Дата створення',
    example: '2025-07-27T15:00:15.314Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата оновлення',
    example: '2025-07-27T15:00:15.314Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Завдання',
    type: 'object',
    additionalProperties: true,
  })
  assignment: any;
}

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'ID користувача',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID завдання',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  @IsString()
  @IsNotEmpty()
  assignmentId: string;

  @ApiProperty({
    description: 'Код рішення',
    example:
      'function factorial(n) {\n  if (n === 0 || n === 1) return 1;\n  return n * factorial(n - 1);\n}',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Мова програмування',
    example: 'javascript',
    required: false,
  })
  @IsString()
  @IsOptional()
  language?: string;
}
