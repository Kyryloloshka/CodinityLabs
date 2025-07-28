import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {
  AssignmentDto,
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from './dto/assignment.dto';
import { SubmissionDto, CreateSubmissionDto } from './dto/submission.dto';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface ErrorResponse {
  message?: string;
}

function isAxiosError(error: unknown): error is AxiosError<unknown> {
  return error instanceof AxiosError;
}

@Injectable()
export class AssignmentsService {
  private readonly assignmentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('ASSIGNMENT_SERVICE_URL');
    if (!url) {
      throw new Error('ASSIGNMENT_SERVICE_URL is not defined');
    }
    this.assignmentServiceUrl = url;
  }

  async findAll(): Promise<AssignmentDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<AssignmentDto[]>>(
          `${this.assignmentServiceUrl}/assignments`,
        ),
      );
      return response.data.data;
    } catch {
      throw new HttpException(
        'Failed to fetch assignments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByTeacher(teacherId: string): Promise<AssignmentDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<AssignmentDto[]>>(
          `${this.assignmentServiceUrl}/assignments/teacher/${teacherId}`,
        ),
      );
      return response.data.data;
    } catch {
      throw new HttpException(
        'Failed to fetch teacher assignments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<AssignmentDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<AssignmentDto>>(
          `${this.assignmentServiceUrl}/assignments/${id}`,
        ),
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to fetch assignment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<AssignmentDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<ApiResponse<AssignmentDto>>(
          `${this.assignmentServiceUrl}/assignments`,
          createAssignmentDto,
        ),
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 400) {
        const errorData = error.response.data as ErrorResponse;
        throw new HttpException(
          errorData.message || 'Invalid data',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create assignment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<AssignmentDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch<ApiResponse<AssignmentDto>>(
          `${this.assignmentServiceUrl}/assignments/${id}`,
          updateAssignmentDto,
        ),
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
        }
        if (error.response?.status === 400) {
          const errorData = error.response.data as ErrorResponse;
          throw new HttpException(
            errorData.message || 'Invalid data',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new HttpException(
        'Failed to update assignment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.assignmentServiceUrl}/assignments/${id}`,
        ),
      );
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to delete assignment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Submission methods
  async findAllSubmissions(): Promise<SubmissionDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<SubmissionDto[]>>(
          `${this.assignmentServiceUrl}/submissions`,
        ),
      );
      return response.data.data;
    } catch {
      throw new HttpException(
        'Failed to fetch submissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSubmissionById(id: string): Promise<SubmissionDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<SubmissionDto>>(
          `${this.assignmentServiceUrl}/submissions/${id}`,
        ),
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to fetch submission',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSubmissionsByUser(userId: string): Promise<SubmissionDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<SubmissionDto[]>>(
          `${this.assignmentServiceUrl}/submissions/user/${userId}`,
        ),
      );
      return response.data.data;
    } catch {
      throw new HttpException(
        'Failed to fetch user submissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSubmissionsByAssignment(
    assignmentId: string,
  ): Promise<SubmissionDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<SubmissionDto[]>>(
          `${this.assignmentServiceUrl}/submissions/assignment/${assignmentId}`,
        ),
      );
      return response.data.data;
    } catch {
      throw new HttpException(
        'Failed to fetch assignment submissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSubmission(
    createSubmissionDto: CreateSubmissionDto,
  ): Promise<SubmissionDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<ApiResponse<SubmissionDto>>(
          `${this.assignmentServiceUrl}/submissions`,
          createSubmissionDto,
        ),
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 400) {
        const errorData = error.response.data as ErrorResponse;
        throw new HttpException(
          errorData.message || 'Invalid data',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to create submission',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeSubmission(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `${this.assignmentServiceUrl}/submissions/${id}`,
        ),
      );
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to delete submission',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
