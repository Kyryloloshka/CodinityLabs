import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('assignments')
@UsePipes(new ValidationPipe({ transform: true }))
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  async create(@Body() createAssignmentDto: CreateAssignmentDto) {
    const assignment = await this.assignmentService.create(createAssignmentDto);
    return ApiResponseDto.success(
      assignment,
      'Assignment created successfully',
    );
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.assignmentService.findAll(paginationDto);
    return ApiResponseDto.success(result, 'Assignments retrieved successfully');
  }

  @Get('teacher/:teacherId')
  async findByTeacher(
    @Param('teacherId') teacherId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const result = await this.assignmentService.findByTeacher(
      teacherId,
      paginationDto,
    );
    return ApiResponseDto.success(
      result,
      'Teacher assignments retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const assignment = await this.assignmentService.findOne(id);
    return ApiResponseDto.success(
      assignment,
      'Assignment retrieved successfully',
    );
  }

  @Get(':id/student')
  async findOneForStudent(@Param('id') id: string) {
    const assignment = await this.assignmentService.findOneForStudent(id);
    return ApiResponseDto.success(
      assignment,
      'Assignment retrieved successfully for student',
    );
  }

  @Get(':id/teacher')
  async findOneForTeacher(@Param('id') id: string) {
    const assignment = await this.assignmentService.findOneForTeacher(id);
    return ApiResponseDto.success(
      assignment,
      'Assignment retrieved successfully for teacher',
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    const assignment = await this.assignmentService.update(
      id,
      updateAssignmentDto,
    );
    return ApiResponseDto.success(
      assignment,
      'Assignment updated successfully',
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.assignmentService.remove(id);
    return ApiResponseDto.success(null, 'Assignment deleted successfully');
  }

  @Get(':id/check-max-attempts/:userId')
  async checkMaxAttempts(
    @Param('id') assignmentId: string,
    @Param('userId') userId: string,
  ) {
    const result = await this.assignmentService.checkMaxAttempts(
      userId,
      assignmentId,
    );
    return ApiResponseDto.success(
      result,
      'Max attempts check completed successfully',
    );
  }
}
