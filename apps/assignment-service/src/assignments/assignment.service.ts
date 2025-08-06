import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentNotFoundException } from '../common/exceptions/custom.exceptions';
import {
  PaginationDto,
  PaginatedResponseDto,
} from '../common/dto/pagination.dto';

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    const { testCases, ...assignmentData } = createAssignmentDto;

    return this.prisma.assignment.create({
      data: {
        ...assignmentData,
        deadline: new Date(assignmentData.deadline),
        testCases: {
          create: testCases,
        },
      },
      include: {
        testCases: true,
      },
    });
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<any>> {
    const {
      page = 1,
      limit = 10,
      search,
      difficulty,
      status,
    } = paginationDto || {};
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

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
      this.prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        include: {
          testCases: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.assignment.count({ where }),
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
  ): Promise<PaginatedResponseDto<any>> {
    const {
      page = 1,
      limit = 10,
      search,
      difficulty,
      status,
    } = paginationDto || {};
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = { teacherId };

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
      this.prisma.assignment.findMany({
        where,
        skip,
        take: limit,
        include: {
          testCases: true,
          _count: {
            select: {
              submissions: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.assignment.count({ where }),
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

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        testCases: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new AssignmentNotFoundException(id);
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    await this.findOne(id);

    const { testCases, ...assignmentData } = updateAssignmentDto;

    return this.prisma.assignment.update({
      where: { id },
      data: {
        ...assignmentData,
        ...(assignmentData.deadline && {
          deadline: new Date(assignmentData.deadline),
        }),
        ...(testCases && {
          testCases: {
            deleteMany: {},
            create: testCases,
          },
        }),
      },
      include: {
        testCases: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.assignment.delete({
      where: { id },
    });
  }
}
