import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionNotFoundException } from '../common/exceptions/custom.exceptions';
import { SubmissionStatus, Prisma } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

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
    this.runTestsAsync(submission.id, createSubmissionDto);

    return submission;
  }

  private async runTestsAsync(submissionId: string, submissionData: CreateSubmissionDto) {
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
      const testCases = assignment.testCases.map(testCase => ({
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
        this.httpService.post(`${this.checkerServiceUrl}/check`, checkRequest)
      );

      const checkResult = response.data as any;

      // Add isPublic information to test results
      const testResultsWithVisibility = checkResult.tests.map((test: any, index: number) => ({
        ...test,
        isPublic: assignment.testCases[index].isPublic,
      }));

      // Update submission with results
      await this.updateStatus(
        submissionId,
        SubmissionStatus.COMPLETED,
        testResultsWithVisibility as Prisma.InputJsonValue,
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
        assignmentId 
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
}
