import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('submissions')
@UsePipes(new ValidationPipe({ transform: true }))
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  async create(@Body() createSubmissionDto: CreateSubmissionDto) {
    const submission = await this.submissionService.create(createSubmissionDto);
    return ApiResponseDto.success(
      submission,
      'Submission created successfully',
    );
  }

  @Get()
  async findAll() {
    const submissions = await this.submissionService.findAll();
    return ApiResponseDto.success(
      submissions,
      'Submissions retrieved successfully',
    );
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    const submissions = await this.submissionService.findByUser(userId);
    return ApiResponseDto.success(
      submissions,
      'User submissions retrieved successfully',
    );
  }

  @Get('assignment/:assignmentId')
  async findByAssignment(@Param('assignmentId') assignmentId: string) {
    const submissions =
      await this.submissionService.findByAssignment(assignmentId);
    return ApiResponseDto.success(
      submissions,
      'Assignment submissions retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const submission = await this.submissionService.findOne(id);
    return ApiResponseDto.success(
      submission,
      'Submission retrieved successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.submissionService.remove(id);
    return ApiResponseDto.success(null, 'Submission deleted successfully');
  }
}
