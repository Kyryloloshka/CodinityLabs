import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  assignmentId: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
