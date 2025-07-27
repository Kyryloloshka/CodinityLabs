import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionNotFoundException } from '../common/exceptions/custom.exceptions';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    return this.prisma.submission.create({
      data: createSubmissionDto,
      include: {
        assignment: {
          include: {
            testCases: true,
          },
        },
      },
    });
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

  async updateStatus(
    id: string,
    status: SubmissionStatus,
    testResults?: any,
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
