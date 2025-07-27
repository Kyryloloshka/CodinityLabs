import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { AssignmentNotFoundException } from '../common/exceptions/custom.exceptions';

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

  async findAll() {
    return this.prisma.assignment.findMany({
      include: {
        testCases: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });
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
