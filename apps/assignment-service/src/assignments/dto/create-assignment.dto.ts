import {
  IsString,
  IsInt,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTestCaseDto {
  @IsString()
  input: string;

  @IsString()
  expected: string;

  @IsString()
  description: string;
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
