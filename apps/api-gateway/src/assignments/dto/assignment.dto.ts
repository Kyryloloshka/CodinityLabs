import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AssignmentSettings,
  TestCase,
  Assignment,
  CreateAssignment,
  UpdateAssignment,
  CreateAssignmentSettings,
  CreateTestCase,
  AssignmentCount,
} from '../../common/types';

export class AssignmentSettingsDto implements AssignmentSettings {
  @ApiProperty({
    description: 'Унікальний ідентифікатор налаштувань',
    example: '72dc290e-6d96-4abd-ac3e-b03f6a921baf',
  })
  id: string;

  @ApiProperty({
    description: 'ID завдання',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  assignmentId: string;

  @ApiProperty({
    description: 'Таймаут виконання коду в мілісекундах',
    example: 2000,
  })
  timeout: number;

  @ApiProperty({
    description: 'Максимальна кількість спроб (null = необмежено)',
    example: null,
    nullable: true,
  })
  maxAttempts: number | null;

  @ApiProperty({
    description: 'Поріг проходження тесту в відсотках',
    example: 80.0,
  })
  passingThreshold: number;

  @ApiProperty({
    description: 'Дозволити часткові бали',
    example: true,
  })
  allowPartialScore: boolean;

  @ApiProperty({
    description: 'Строгий режим перевірки',
    example: false,
  })
  strictMode: boolean;

  @ApiProperty({
    description: 'Дата створення',
    example: '2025-07-27T15:00:02.332Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата оновлення',
    example: '2025-07-27T15:00:02.332Z',
  })
  updatedAt: string;
}

export class TestCaseDto implements TestCase {
  @ApiProperty({
    description: 'Унікальний ідентифікатор тестового випадку',
    example: '72dc290e-6d96-4abd-ac3e-b03f6a921baf',
  })
  id: string;

  @ApiProperty({
    description: 'Вхідні дані для тесту',
    example: '5',
  })
  input: string;

  @ApiProperty({
    description: 'Очікуваний результат',
    example: '120',
  })
  expected: string;

  @ApiProperty({
    description: 'Опис тестового випадку',
    example: 'Факторіал числа 5',
  })
  description: string;

  @ApiProperty({
    description: 'Чи тест видимий студентам',
    example: true,
  })
  isPublic: boolean;

  @ApiProperty({
    description: 'ID завдання',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  assignmentId: string;

  @ApiProperty({
    description: 'Дата створення',
    example: '2025-07-27T15:00:02.332Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата оновлення',
    example: '2025-07-27T15:00:02.332Z',
  })
  updatedAt: string;
}

export class AssignmentDto implements Assignment {
  @ApiProperty({
    description: 'Унікальний ідентифікатор завдання',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  id: string;

  @ApiProperty({
    description: 'Назва завдання',
    example: 'Функція для обчислення факторіалу',
  })
  title: string;

  @ApiProperty({
    description: 'Опис завдання',
    example: 'Напишіть функцію, яка обчислює факторіал числа n.',
  })
  description: string;

  @ApiProperty({
    description: 'Складність завдання (1-10)',
    example: 3,
    minimum: 1,
    maximum: 10,
  })
  difficulty: number;

  @ApiProperty({
    description: 'Термін здачі',
    example: '2024-12-31T23:59:59.000Z',
  })
  deadline: string;

  @ApiProperty({
    description: 'ID викладача',
    example: 'teacher123',
  })
  teacherId: string;

  @ApiProperty({
    description: 'Дата створення',
    example: '2025-07-27T15:00:02.332Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Дата оновлення',
    example: '2025-07-27T15:00:02.332Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Тестові випадки',
    type: [TestCaseDto],
  })
  testCases: TestCaseDto[];

  @ApiProperty({
    description: 'Налаштування перевірки завдання',
    type: AssignmentSettingsDto,
    required: false,
  })
  settings?: AssignmentSettingsDto;

  @ApiProperty({
    description: 'Кількість подань',
    example: { submissions: 0 },
  })
  _count: AssignmentCount;
}

export class CreateAssignmentSettingsDto implements CreateAssignmentSettings {
  @ApiProperty({
    description: 'Таймаут виконання коду в мілісекундах',
    example: 2000,
    minimum: 200,
    maximum: 5000,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(200)
  @Max(5000)
  timeout?: number;

  @ApiProperty({
    description: 'Максимальна кількість спроб (null = необмежено)',
    example: null,
    nullable: true,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxAttempts?: number | null;

  @ApiProperty({
    description: 'Поріг проходження тесту в відсотках',
    example: 80.0,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingThreshold?: number;

  @ApiProperty({
    description: 'Дозволити часткові бали',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  allowPartialScore?: boolean;

  @ApiProperty({
    description: 'Строгий режим перевірки',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  strictMode?: boolean;
}

export class CreateTestCaseDto implements CreateTestCase {
  @ApiProperty({
    description: 'Вхідні дані для тесту',
    example: '5',
  })
  @IsString()
  input: string;

  @ApiProperty({
    description: 'Очікуваний результат',
    example: '120',
  })
  @IsString()
  expected: string;

  @ApiProperty({
    description: 'Опис тестового випадку',
    example: 'Факторіал числа 5',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Чи тест видимий студентам',
    example: true,
    default: true,
  })
  @IsBoolean()
  isPublic: boolean = true;
}

export class CreateAssignmentDto implements CreateAssignment {
  @ApiProperty({
    description: 'Назва завдання',
    example: 'Функція для обчислення факторіалу',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Опис завдання',
    example: 'Напишіть функцію, яка обчислює факторіал числа n.',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Складність завдання (1-10)',
    example: 3,
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  difficulty: number;

  @ApiProperty({
    description: 'Термін здачі',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsDateString()
  deadline: string;

  @ApiProperty({
    description: 'ID викладача',
    example: 'teacher123',
  })
  @IsString()
  teacherId: string;

  @ApiProperty({
    description: 'Тестові випадки',
    type: [CreateTestCaseDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseDto)
  testCases: CreateTestCaseDto[];

  @ApiProperty({
    description: 'Налаштування перевірки завдання',
    type: CreateAssignmentSettingsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAssignmentSettingsDto)
  settings?: CreateAssignmentSettingsDto;
}

export class UpdateAssignmentDto implements UpdateAssignment {
  @ApiProperty({
    description: 'Назва завдання',
    example: 'Оновлена назва завдання',
    required: false,
  })
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Опис завдання',
    example: 'Оновлений опис завдання',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Складність завдання (1-10)',
    example: 4,
    minimum: 1,
    maximum: 10,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  difficulty?: number;

  @ApiProperty({
    description: 'Термін здачі',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsDateString()
  deadline?: string;

  @ApiProperty({
    description: 'ID викладача',
    example: 'teacher123',
    required: false,
  })
  @IsString()
  teacherId?: string;

  @ApiProperty({
    description: 'Тестові випадки',
    type: [CreateTestCaseDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseDto)
  testCases?: CreateTestCaseDto[];

  @ApiProperty({
    description: 'Налаштування перевірки завдання',
    type: CreateAssignmentSettingsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAssignmentSettingsDto)
  settings?: CreateAssignmentSettingsDto;
}
