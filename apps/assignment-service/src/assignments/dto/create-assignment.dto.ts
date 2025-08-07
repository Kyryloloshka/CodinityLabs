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

export class CreateTestCaseDto {
  @IsString()
  input: string;

  @IsString()
  expected: string;

  @IsString()
  description: string;

  @IsBoolean()
  isPublic: boolean = true; // За замовчуванням тест публічний
}

export class CreateAssignmentSettingsDto {
  @IsOptional()
  @IsInt()
  @Min(200)
  @Max(5000)
  timeout?: number = 2000; // Таймаут в мілісекундах (200мс-5с)

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  maxAttempts?: number | null = null; // Максимальна кількість спроб (null = необмежено)

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingThreshold?: number = 80.0; // Поріг проходження тесту в відсотках

  @IsOptional()
  @IsBoolean()
  allowPartialScore?: boolean = true; // Дозволити часткові бали

  @IsOptional()
  @IsBoolean()
  strictMode?: boolean = false; // Строгий режим (всі тести мають пройти)
}

export class CreateAssignmentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  @Max(10)
  difficulty: number;

  @IsDateString()
  deadline: string;

  @IsString()
  teacherId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseDto)
  testCases: CreateTestCaseDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAssignmentSettingsDto)
  settings?: CreateAssignmentSettingsDto;
}
