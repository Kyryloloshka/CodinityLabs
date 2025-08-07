import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import { SubmissionDto, CreateSubmissionDto } from './dto/submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Submissions')
@Controller('submissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubmissionsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all submissions',
    description: 'Get all submissions from Assignment Service',
  })
  @ApiOkResponse({
    description: 'All submissions successfully retrieved',
    type: [SubmissionDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(): Promise<SubmissionDto[]> {
    return this.assignmentsService.findAllSubmissions();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get submission by ID',
    description: 'Get submission by unique identifier from Assignment Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор подання',
    example: '89d47645-d28e-480c-8de7-a41b556fa93c',
  })
  @ApiOkResponse({
    description: 'Submission successfully found',
    type: SubmissionDto,
  })
  @ApiNotFoundResponse({
    description: 'Submission not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SubmissionDto> {
    return this.assignmentsService.findSubmissionById(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get submissions by user',
    description: 'Get all submissions for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user123',
  })
  @ApiOkResponse({
    description: 'User submissions successfully retrieved',
    type: [SubmissionDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findByUser(@Param('userId') userId: string): Promise<SubmissionDto[]> {
    return this.assignmentsService.findSubmissionsByUser(userId);
  }

  @Get('assignment/:assignmentId')
  @ApiOperation({
    summary: 'Get submissions by assignment',
    description: 'Get all submissions for a specific assignment',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment identifier',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  @ApiOkResponse({
    description: 'Assignment submissions successfully retrieved',
    type: [SubmissionDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findByAssignment(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
  ): Promise<SubmissionDto[]> {
    return this.assignmentsService.findSubmissionsByAssignment(assignmentId);
  }

  @Get('assignment/:assignmentId/statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get assignment statistics',
    description:
      'Get statistics for all submissions of a specific assignment grouped by users',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment identifier',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  @ApiOkResponse({
    description: 'Assignment statistics successfully retrieved',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getAssignmentStatistics(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
  ): Promise<any> {
    return this.assignmentsService.getAssignmentStatistics(assignmentId);
  }

  @Get('assignment/:assignmentId/statistics-with-users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get assignment statistics with user information',
    description:
      'Get statistics for all submissions of a specific assignment grouped by users with user details',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment identifier',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  @ApiOkResponse({
    description:
      'Assignment statistics with user information successfully retrieved',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getAssignmentStatisticsWithUsers(
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
  ): Promise<any> {
    return this.assignmentsService.getAssignmentStatisticsWithUsers(
      assignmentId,
    );
  }

  @Get('user/:userId/assignment/:assignmentId')
  @ApiOperation({
    summary: 'Get user submissions for specific assignment',
    description: 'Get all submissions for a specific user and assignment',
  })
  @ApiParam({
    name: 'userId',
    description: 'User identifier',
    example: 'user123',
  })
  @ApiParam({
    name: 'assignmentId',
    description: 'Assignment identifier',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  @ApiOkResponse({
    description: 'User assignment submissions successfully retrieved',
    type: [SubmissionDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findByUserAndAssignment(
    @Param('userId') userId: string,
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
  ): Promise<SubmissionDto[]> {
    return this.assignmentsService.findSubmissionsByUserAndAssignment(
      userId,
      assignmentId,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create submission',
    description: 'Create new submission through Assignment Service',
  })
  @ApiBody({
    type: CreateSubmissionDto,
    description: 'Submission data to create',
  })
  @ApiOkResponse({
    description: 'Submission successfully created',
    type: SubmissionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @ApiResponse({
    status: 429,
    description: 'Maximum attempts limit reached',
  })
  async create(
    @Body() createSubmissionDto: CreateSubmissionDto,
  ): Promise<SubmissionDto> {
    return this.assignmentsService.createSubmission(createSubmissionDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete submission',
    description: 'Delete submission through Assignment Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique submission identifier',
    example: '89d47645-d28e-480c-8de7-a41b556fa93c',
  })
  @ApiOkResponse({
    description: 'Submission successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Submission not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.assignmentsService.removeSubmission(id);
  }
}
