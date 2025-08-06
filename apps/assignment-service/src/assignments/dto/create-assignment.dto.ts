import {
  IsString,
  IsInt,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsBoolean,
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
}
