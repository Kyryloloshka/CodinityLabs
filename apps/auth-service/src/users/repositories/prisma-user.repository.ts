import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '../interfaces/user.repository.interface';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserData): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    console.log('PrismaUserRepository.findById - searching for id:', id);
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      console.log('PrismaUserRepository.findById - found user:', user);
      return user;
    } catch (error) {
      console.error('PrismaUserRepository.findById - error:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
