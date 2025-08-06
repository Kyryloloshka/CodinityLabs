import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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
    description: 'Код для перевірки',
    example: 'function main(input) { return input * 2; }',
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

  @ApiProperty({
    description: 'ID завдання для автоматичного отримання тестів',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
    required: false,
  })
  @IsString()
  @IsOptional()
  assignmentId?: string;

  @ApiProperty({
    description: 'Тестові випадки (використовуються якщо assignmentId не передано)',
    type: [TestCaseDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestCaseDto)
  @IsOptional()
  testCases?: TestCaseDto[];
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
    description: 'Результати тестів',
    type: [TestResultDto],
  })
  tests: TestResultDto[];

  @ApiProperty({
    description: 'Загальна оцінка',
    example: 100,
  })
  score: number;
}
