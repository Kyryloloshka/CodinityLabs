import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
} from '@nestjs/swagger';
import { AssignmentsService } from './assignments.service';
import {
  AssignmentDto,
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from './dto/assignment.dto';
import { CheckDto, CheckResultDto } from './dto/checker.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Assignments')
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all assignments',
    description: 'Get all assignments from Assignment Service (public access)',
  })
  @ApiOkResponse({
    description: 'All assignments successfully retrieved',
    type: [AssignmentDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(): Promise<AssignmentDto[]> {
    return this.assignmentsService.findAll();
  }

  @Get('teacher/:teacherId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get assignments by teacher',
    description: 'Get all assignments created by a specific teacher',
  })
  @ApiParam({
    name: 'teacherId',
    description: 'Teacher identifier',
    example: 'teacher123',
  })
  @ApiOkResponse({
    description: 'Teacher assignments successfully retrieved',
    type: [AssignmentDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findByTeacher(
    @Param('teacherId') teacherId: string,
  ): Promise<AssignmentDto[]> {
    return this.assignmentsService.findByTeacher(teacherId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get assignment by ID',
    description:
      'Get assignment by unique identifier from Assignment Service (public access)',
  })
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор завдання',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  @ApiOkResponse({
    description: 'Assignment successfully found',
    type: AssignmentDto,
  })
  @ApiNotFoundResponse({
    description: 'Assignment not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AssignmentDto> {
    return this.assignmentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create assignment',
    description: 'Create new assignment through Assignment Service',
  })
  @ApiBody({
    type: CreateAssignmentDto,
    description: 'Assignment data to create',
  })
  @ApiOkResponse({
    description: 'Assignment successfully created',
    type: AssignmentDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<AssignmentDto> {
    return this.assignmentsService.create(createAssignmentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update assignment',
    description: 'Update existing assignment through Assignment Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique assignment identifier',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  @ApiBody({
    type: UpdateAssignmentDto,
    description: 'Data to update assignment',
  })
  @ApiOkResponse({
    description: 'Assignment successfully updated',
    type: AssignmentDto,
  })
  @ApiNotFoundResponse({
    description: 'Assignment not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid data provided',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<AssignmentDto> {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete assignment',
    description: 'Delete assignment through Assignment Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique assignment identifier',
    example: 'a82940b0-cff0-42df-b4c4-0ff66a2a30fc',
  })
  @ApiOkResponse({
    description: 'Assignment successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Assignment not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.assignmentsService.remove(id);
  }

  @Post('check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check code',
    description: 'Check code using Checker Service',
  })
  @ApiBody({
    type: CheckDto,
    description: 'Code and test cases to check',
  })
  @ApiOkResponse({
    description: 'Code check completed successfully',
    type: CheckResultDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid code data provided',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async checkCode(@Body() checkDto: CheckDto): Promise<CheckResultDto> {
    return this.assignmentsService.checkCode(checkDto);
  }
}
