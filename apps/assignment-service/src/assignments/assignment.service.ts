import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentNotFoundException } from '../common/exceptions/custom.exceptions';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../common/dto/pagination.dto';
import { Assignment, TestCase, AssignmentSettings } from '@prisma/client';

type AssignmentWithRelations = Assignment & {
  testCases: TestCase[];
  settings: AssignmentSettings | null;
  _count?: {
    submissions: number;
  };
};

interface WhereFilter {
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
  difficulty?: number;
  deadline?: { gt: Date } | { lte: Date };
  teacherId?: string;
}

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAssignmentDto: CreateAssignmentDto,
  ): Promise<AssignmentWithRelations> {
    const { testCases, settings, ...assignmentData } = createAssignmentDto;

    const publicTests = testCases.filter((tc) => tc.isPublic);
    if (publicTests.length < 3) {
      throw new Error('Потрібно мінімум 3 публічних тести для завдання');
    }

    return (await this.prisma.assignment.create({
      data: {
        ...assignmentData,
        deadline: new Date(assignmentData.deadline),
        testCases: {
          create: testCases,
        },
        settings: settings
          ? {
              create: settings,
            }
          : undefined,
      },
      include: {
        testCases: true,
        settings: true,
      },
    })) as unknown as AssignmentWithRelations;
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<AssignmentWithRelations>> {
    const {
      page = 1,
      limit = 10,
      search,
      difficulty,
      status,
    } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: WhereFilter = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (status) {
      const now = new Date();
      if (status === 'active') {
        where.deadline = { gt: now };
      } else if (status === 'completed') {
        where.deadline = { lte: now };
      }
    }

    const [assignments, total] = await Promise.all([
      (await this.prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        include: {
          testCases: true,
          settings: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })) as unknown as AssignmentWithRelations[],

      this.prisma.assignment.count({ where }) as Promise<number>,
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: assignments,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findByTeacher(
    teacherId: string,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<AssignmentWithRelations>> {
    const {
      page = 1,
      limit = 10,
      search,
      difficulty,
      status,
    } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: WhereFilter = {
      teacherId,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (status) {
      const now = new Date();
      if (status === 'active') {
        where.deadline = { gt: now };
      } else if (status === 'completed') {
        where.deadline = { lte: now };
      }
    }

    const [assignments, total] = await Promise.all([
      (await this.prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        include: {
          testCases: true,
          settings: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })) as unknown as AssignmentWithRelations[],

      this.prisma.assignment.count({ where }) as Promise<number>,
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: assignments,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<AssignmentWithRelations> {
    const assignment = (await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        testCases: true,
        settings: true,
      },
    })) as unknown as AssignmentWithRelations | null;

    if (!assignment) {
      throw new AssignmentNotFoundException(id);
    }

    return assignment;
  }

  async findOneForStudent(id: string): Promise<AssignmentWithRelations> {
    const assignment = (await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        testCases: {
          where: { isPublic: true },
        },
        settings: true,
      },
    })) as unknown as AssignmentWithRelations | null;

    if (!assignment) {
      throw new AssignmentNotFoundException(id);
    }

    return assignment;
  }

  async findOneForTeacher(id: string): Promise<AssignmentWithRelations> {
    const assignment = (await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        testCases: true,
        settings: true,
      },
    })) as unknown as AssignmentWithRelations | null;

    if (!assignment) {
      throw new AssignmentNotFoundException(id);
    }

    return assignment;
  }

  async update(
    id: string,
    updateAssignmentDto: UpdateAssignmentDto,
  ): Promise<AssignmentWithRelations> {
    const { testCases, settings, ...assignmentData } = updateAssignmentDto;

    const existingAssignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: { testCases: true },
    });

    if (!existingAssignment) {
      throw new AssignmentNotFoundException(id);
    }

    return (await this.prisma.assignment.update({
      where: { id },
      data: {
        ...assignmentData,
        deadline: assignmentData.deadline
          ? new Date(assignmentData.deadline)
          : undefined,
        testCases: testCases
          ? {
              deleteMany: {},
              create: testCases,
            }
          : undefined,
        settings: settings
          ? {
              upsert: {
                create: settings,
                update: settings,
              },
            }
          : undefined,
      },
      include: {
        testCases: true,
        settings: true,
      },
    })) as unknown as AssignmentWithRelations;
  }

  async remove(id: string): Promise<AssignmentWithRelations> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new AssignmentNotFoundException(id);
    }

    return (await this.prisma.assignment.delete({
      where: { id },
      include: {
        testCases: true,
        settings: true,
      },
    })) as unknown as AssignmentWithRelations;
  }

  async checkMaxAttempts(
    userId: string,
    assignmentId: string,
  ): Promise<{
    canSubmit: boolean;
    currentAttempts: number;
    maxAttempts: number | null;
  }> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { settings: true },
    });

    if (!assignment) {
      throw new AssignmentNotFoundException(assignmentId);
    }

    const currentAttempts = await this.prisma.submission.count({
      where: {
        userId,
        assignmentId,
      },
    });

    const maxAttempts = assignment.settings?.maxAttempts || null;

    return {
      canSubmit: maxAttempts === null || currentAttempts < maxAttempts,
      currentAttempts,
      maxAttempts,
    };
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
