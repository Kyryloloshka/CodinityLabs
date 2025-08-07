import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CreateAssignmentDto } from './dto/assignment.dto';
import { UpdateAssignmentDto } from './dto/assignment.dto';
import { CreateSubmissionDto } from './dto/submission.dto';
import { CheckDto } from './dto/checker.dto';
import { CheckResultDto } from './dto/checker.dto';
import { AssignmentDto } from './dto/assignment.dto';
import { SubmissionDto } from './dto/submission.dto';
import type { AxiosError } from 'axios';

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface PaginatedApiResponse<T> {
  data: {
    data: T[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message?: string;
}

interface ErrorResponse {
  message?: string;
}

interface UserStatistics {
  userId: string;
  totalSubmissions: number;
  successfulSubmissions: number;
  averageScore: number;
  lastSubmissionDate?: string;
}

interface AssignmentStatistics {
  assignmentId: string;
  totalSubmissions: number;
  uniqueUsers: number;
  averageScore: number;
  userStatistics: UserStatistics[];
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserStatisticsWithUser extends UserStatistics {
  user: UserInfo;
}

interface AssignmentStatisticsWithUsers
  extends Omit<AssignmentStatistics, 'userStatistics'> {
  userStatistics: UserStatisticsWithUser[];
}

function isAxiosError(error: unknown): error is AxiosError<unknown> {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
}

@Injectable()
export class AssignmentsService {
  private readonly assignmentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.assignmentServiceUrl =
      this.configService.get<string>('ASSIGNMENT_SERVICE_URL') ||
      'http://localhost:3002';
  }

  private get checkerServiceUrl(): string {
    return (
      this.configService.get<string>('CHECKER_SERVICE_URL') ||
      'http://localhost:3003'
    );
  }

  async findAll(
    page?: number,
    limit?: number,
    search?: string,
    difficulty?: number,
    status?: string,
  ): Promise<PaginatedApiResponse<AssignmentDto>['data']> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (difficulty) params.append('difficulty', difficulty.toString());
      if (status) params.append('status', status);

      const response = await firstValueFrom(
        this.httpService.get<PaginatedApiResponse<AssignmentDto>>(
          `${this.assignmentServiceUrl}/assignments?${params.toString()}`,
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

  async findByTeacher(
    teacherId: string,
    page?: number,
    limit?: number,
    search?: string,
    difficulty?: number,
    status?: string,
  ): Promise<PaginatedApiResponse<AssignmentDto>['data']> {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      if (search) params.append('search', search);
      if (difficulty) params.append('difficulty', difficulty.toString());
      if (status) params.append('status', status);

      const response = await firstValueFrom(
        this.httpService.get<PaginatedApiResponse<AssignmentDto>>(
          `${this.assignmentServiceUrl}/assignments/teacher/${teacherId}?${params.toString()}`,
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

  async findOneForStudent(id: string): Promise<AssignmentDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<AssignmentDto>>(
          `${this.assignmentServiceUrl}/assignments/${id}/student`,
        ),
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to fetch assignment for student',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneForTeacher(id: string): Promise<AssignmentDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<AssignmentDto>>(
          `${this.assignmentServiceUrl}/assignments/${id}/teacher`,
        ),
      );
      return response.data.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to fetch assignment for teacher',
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

  async getAssignmentStatistics(
    assignmentId: string,
  ): Promise<AssignmentStatistics> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<AssignmentStatistics>>(
          `${this.assignmentServiceUrl}/assignments/${assignmentId}/statistics`,
        ),
      );
      return response.data.data;
    } catch {
      throw new HttpException(
        'Failed to fetch assignment statistics',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAssignmentStatisticsWithUsers(
    assignmentId: string,
  ): Promise<AssignmentStatisticsWithUsers> {
    try {
      // Отримуємо статистику
      const statistics = await this.getAssignmentStatistics(assignmentId);

      // Отримуємо інформацію про користувачів
      const userIds = statistics.userStatistics.map(stat => stat.userId);
      const users = await Promise.all(
        userIds.map(async (userId: string) => {
          try {
            return await this.authService.findUserById(userId);
          } catch {
            // Якщо користувача не знайдено, повертаємо базову інформацію
            return {
              id: userId,
              name: `Студент ${userId.slice(0, 8)}`,
              email: 'unknown@example.com',
              role: 'STUDENT',
              createdAt: new Date().toISOString(),
            };
          }
        }),
      );

      // Додаємо інформацію про користувачів до статистики
      const userMap: Record<string, UserInfo> = {};
      users.forEach(user => {
        userMap[user.id] = user;
      });

      const userStatisticsWithUsers: UserStatisticsWithUser[] =
        statistics.userStatistics.map(stat => ({
          ...stat,
          user: userMap[stat.userId] || {
            id: stat.userId,
            name: `Студент ${stat.userId.slice(0, 8)}`,
            email: 'unknown@example.com',
            role: 'STUDENT',
            createdAt: new Date().toISOString(),
          },
        }));

      return {
        ...statistics,
        userStatistics: userStatisticsWithUsers,
      };
    } catch {
      throw new HttpException(
        'Failed to fetch assignment statistics with users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findSubmissionsByUserAndAssignment(
    userId: string,
    assignmentId: string,
  ): Promise<SubmissionDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ApiResponse<SubmissionDto[]>>(
          `${this.assignmentServiceUrl}/submissions/user/${userId}/assignment/${assignmentId}`,
        ),
      );
      return response.data.data;
    } catch {
      throw new HttpException(
        'Failed to fetch user assignment submissions',
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
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          const errorData = error.response.data as ErrorResponse;
          throw new HttpException(
            errorData.message || 'Invalid data',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (error.response?.status === 429) {
          const errorData = error.response.data as ErrorResponse;
          throw new HttpException(
            errorData.message || 'Maximum attempts limit reached',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
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

  async checkCode(checkDto: CheckDto): Promise<CheckResultDto> {
    try {
      if (checkDto.assignmentId) {
        const assignment = await this.findOne(checkDto.assignmentId);
        checkDto.testCases = assignment.testCases.map(
          (testCase: {
            input: string;
            expected: string;
            description: string;
            isPublic: boolean;
          }) => ({
            input: testCase.input,
            expected: testCase.expected,
            description: testCase.description,
            isPublic: testCase.isPublic,
          }),
        );

        if (assignment.settings && assignment.settings.timeout) {
          checkDto.settings = {
            timeout: assignment.settings.timeout,
            maxAttempts: assignment.settings.maxAttempts,
            passingThreshold: assignment.settings.passingThreshold,
            allowPartialScore: assignment.settings.allowPartialScore,
            strictMode: assignment.settings.strictMode,
          };
        }
      }

      if (!checkDto.testCases || checkDto.testCases.length === 0) {
        throw new HttpException(
          'No test cases provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      const response = await firstValueFrom(
        this.httpService.post<CheckResultDto>(
          `${this.checkerServiceUrl}/check`,
          checkDto,
        ),
      );
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 400) {
        const errorData = error.response.data as ErrorResponse;
        throw new HttpException(
          errorData.message || 'Invalid code data',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to check code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkMaxAttempts(
    userId: string,
    assignmentId: string,
  ): Promise<{
    canSubmit: boolean;
    currentAttempts: number;
    maxAttempts: number | null;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<
          ApiResponse<{
            canSubmit: boolean;
            currentAttempts: number;
            maxAttempts: number | null;
          }>
        >(
          `${this.assignmentServiceUrl}/assignments/${assignmentId}/check-max-attempts/${userId}`,
        ),
      );
      return response.data.data;
    } catch {
      throw new HttpException(
        'Failed to check max attempts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
