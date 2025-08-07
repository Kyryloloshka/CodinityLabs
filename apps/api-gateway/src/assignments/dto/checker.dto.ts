import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CheckSettingsDto {
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

export class TestCaseDto {
  @ApiProperty({
    description: 'Вхідні дані для тесту',
    example: '5',
  })
  @IsString()
  @IsNotEmpty()
  input: string;

  @ApiProperty({
    description: 'Очікуваний результат',
    example: '10',
  })
  @IsString()
  @IsNotEmpty()
  expected: string;

  @ApiProperty({
    description: 'Опис тесту',
    example: 'Test multiplication by 2',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CheckDto {
  @ApiProperty({
    description: 'Code to check',
    example: 'function main(input) { return input * 2; }',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Programming language',
    example: 'javascript',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'Assignment ID',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
    required: false,
  })
  @IsOptional()
  @IsString()
  assignmentId?: string;

  @ApiProperty({
    description: 'User ID for submission tracking',
    example: 'user123',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Test cases to run',
    type: [TestCaseDto],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  testCases?: TestCaseDto[];

  @ApiProperty({
    description: 'Налаштування перевірки коду',
    type: CheckSettingsDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CheckSettingsDto)
  settings?: CheckSettingsDto;
}

export class LintErrorDto {
  @ApiProperty({
    description: 'ID правила',
    example: 'missing-main-function',
  })
  ruleId: string;

  @ApiProperty({
    description: 'Серйозність помилки (1 - warning, 2 - error)',
    example: 2,
  })
  severity: number;

  @ApiProperty({
    description: 'Повідомлення про помилку',
    example: 'Function main is required',
  })
  message: string;

  @ApiProperty({
    description: 'Номер рядка',
    example: 1,
  })
  line: number;

  @ApiProperty({
    description: 'Номер колонки',
    example: 1,
  })
  column: number;
}

export class TestResultDto {
  @ApiProperty({
    description: 'Чи пройшов тест',
    example: true,
  })
  passed: boolean;

  @ApiProperty({
    description: 'Фактичний результат',
    example: '10',
  })
  actual: string;

  @ApiProperty({
    description: 'Очікуваний результат',
    example: '10',
  })
  expected: string;

  @ApiProperty({
    description: 'Опис тесту',
    example: 'Test multiplication by 2',
  })
  description: string;

  @ApiProperty({
    description: 'Вхідні дані',
    example: 5,
  })
  input: string;
}

export class CheckResultDto {
  @ApiProperty({
    description: 'Помилки lint',
    type: [LintErrorDto],
  })
  lint: LintErrorDto[];

  @ApiProperty({
    description: 'Результати тестів (тільки публічні)',
    type: [TestResultDto],
  })
  tests: TestResultDto[];

  @ApiProperty({
    description: 'Загальна оцінка',
    example: 100,
  })
  score: number;

  @ApiProperty({
    description: 'Статистика тестів',
    example: {
      total: 10,
      passed: 7,
      failed: 2,
      timeout: 1,
      public: 5,
    },
  })
  testStats: {
    total: number;
    passed: number;
    failed: number;
    timeout: number;
    public: number;
  };

  @ApiProperty({
    description: 'Чи пройшов поріг проходження',
    example: true,
  })
  passedThreshold: boolean;

  @ApiProperty({
    description: 'Використані налаштування перевірки',
    type: CheckSettingsDto,
  })
  settings: CheckSettingsDto;
}
