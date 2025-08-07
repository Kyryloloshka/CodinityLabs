import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionNotFoundException } from '../common/exceptions/custom.exceptions';
import { SubmissionStatus, Prisma } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

interface TestResult {
  passed: boolean;
  actual: string;
  expected: string;
  description: string;
  input: string;
}

interface TestResultWithVisibility extends TestResult {
  isPublic: boolean;
}

interface CheckResult {
  tests: TestResult[];
  score: number;
}

@Injectable()
export class SubmissionService {
  private readonly checkerServiceUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('CHECKER_SERVICE_URL');
    if (!url) {
      throw new Error('CHECKER_SERVICE_URL is not defined');
    }
    this.checkerServiceUrl = url;
  }

  async create(createSubmissionDto: CreateSubmissionDto) {
    // Check max attempts before creating submission
    const maxAttemptsCheck = await this.checkMaxAttempts(
      createSubmissionDto.userId,
      createSubmissionDto.assignmentId,
    );

    if (!maxAttemptsCheck.canSubmit) {
      throw new HttpException(
        {
          message: 'Maximum attempts limit reached',
          currentAttempts: maxAttemptsCheck.currentAttempts,
          maxAttempts: maxAttemptsCheck.maxAttempts,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Create submission with PENDING status
    const submission = await this.prisma.submission.create({
      data: {
        ...createSubmissionDto,
        status: SubmissionStatus.PROCESSING,
      },
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
    });

    // Run tests asynchronously
    void this.runTestsAsync(submission.id, createSubmissionDto);

    return submission;
  }

  private async checkMaxAttempts(
    userId: string,
    assignmentId: string,
  ): Promise<{
    canSubmit: boolean;
    currentAttempts: number;
    maxAttempts: number | null;
  }> {
    // Get assignment with settings
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        settings: true,
      },
    });

    if (!assignment) {
      throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
    }

    // If no maxAttempts is set, user can always submit
    if (!assignment.settings?.maxAttempts) {
      return {
        canSubmit: true,
        currentAttempts: 0,
        maxAttempts: null,
      };
    }

    // Count current submissions for this user and assignment
    const currentAttempts = await this.prisma.submission.count({
      where: {
        userId,
        assignmentId,
      },
    });

    const canSubmit = currentAttempts < assignment.settings.maxAttempts;

    return {
      canSubmit,
      currentAttempts,
      maxAttempts: assignment.settings.maxAttempts,
    };
  }

  private async runTestsAsync(
    submissionId: string,
    submissionData: CreateSubmissionDto,
  ) {
    try {
      // Get assignment with test cases
      const assignment = await this.prisma.assignment.findUnique({
        where: { id: submissionData.assignmentId },
        include: { testCases: true },
      });

      if (!assignment) {
        throw new Error('Assignment not found');
      }

      // Prepare test cases for checker service
      const testCases = assignment.testCases.map((testCase) => ({
        input: testCase.input,
        expected: testCase.expected,
        description: testCase.description,
      }));

      // Send to checker service
      const checkRequest = {
        code: submissionData.code,
        language: submissionData.language || 'javascript',
        testCases,
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.checkerServiceUrl}/check`, checkRequest),
      );

      const checkResult = response.data as CheckResult;

      // Add isPublic information to test results
      const testResultsWithVisibility: TestResultWithVisibility[] =
        checkResult.tests.map((test: TestResult, index: number) => ({
          ...test,
          isPublic: assignment.testCases[index].isPublic,
        }));

      // Update submission with results
      await this.updateStatus(
        submissionId,
        SubmissionStatus.COMPLETED,
        testResultsWithVisibility as unknown as Prisma.InputJsonValue,
        checkResult.score,
      );
    } catch (error) {
      console.error('Error running tests for submission:', submissionId, error);

      // Update submission with FAILED status
      await this.updateStatus(
        submissionId,
        SubmissionStatus.FAILED,
        undefined,
        undefined,
      );
    }
  }

  async findAll() {
    return this.prisma.submission.findMany({
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
    });

    if (!submission) {
      throw new SubmissionNotFoundException(id);
    }

    return submission;
  }

  async findByUser(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
    });
  }

  async findByAssignment(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
    });
  }

  async findByUserAndAssignment(userId: string, assignmentId: string) {
    return this.prisma.submission.findMany({
      where: {
        userId,
        assignmentId,
      },
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(
    id: string,
    status: SubmissionStatus,
    testResults?: Prisma.InputJsonValue,
    score?: number,
  ) {
    await this.findOne(id);

    return this.prisma.submission.update({
      where: { id },
      data: {
        status,
        testResults,
        score,
      },
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.submission.delete({
      where: { id },
    });
  }

  async getAssignmentStatistics(assignmentId: string) {
    const submissions = await this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Групуємо подання по користувачах
    const userSubmissions = submissions.reduce(
      (acc, submission) => {
        if (!acc[submission.userId]) {
          acc[submission.userId] = [];
        }
        acc[submission.userId].push(submission);
        return acc;
      },
      {} as Record<string, typeof submissions>,
    );

    // Підраховуємо статистику для кожного користувача
    const statistics = Object.entries(userSubmissions).map(
      ([userId, userSubs]) => {
        const totalSubmissions = userSubs.length;
        const completedSubmissions = userSubs.filter(
          (sub) => sub.status === 'COMPLETED',
        ).length;
        const failedSubmissions = userSubs.filter(
          (sub) => sub.status === 'FAILED',
        ).length;
        const pendingSubmissions = userSubs.filter(
          (sub) => sub.status === 'PENDING' || sub.status === 'PROCESSING',
        ).length;

        // Знаходимо найкращий результат
        const bestSubmission = userSubs
          .filter((sub) => sub.score !== null)
          .sort((a, b) => (b.score || 0) - (a.score || 0))[0];

        return {
          userId,
          totalSubmissions,
          completedSubmissions,
          failedSubmissions,
          pendingSubmissions,
          bestScore: bestSubmission?.score || null,
          lastSubmission: userSubs[0], // Перший в списку (найновіший через orderBy)
          submissions: userSubs,
        };
      },
    );

    return {
      assignmentId,
      totalUsers: statistics.length,
      totalSubmissions: submissions.length,
      userStatistics: statistics,
    };
  }
}
