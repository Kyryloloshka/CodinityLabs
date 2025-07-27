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
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

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
  async findAll() {
    const assignments = await this.assignmentService.findAll();
    return ApiResponseDto.success(
      assignments,
      'Assignments retrieved successfully',
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
}
