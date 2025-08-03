import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IRefreshTokenRepository,
  CreateRefreshTokenData,
  RefreshToken,
} from '../interfaces/refresh-token.repository.interface';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const result = await this.prisma.refreshToken.create({
      data: {
        token: data.token,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
    return result as RefreshToken;
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const result = await this.prisma.refreshToken.findUnique({
      where: { token },
    });
    return result as RefreshToken | null;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const result = await this.prisma.refreshToken.findMany({
      where: { userId },
    });
    return result as RefreshToken[];
  }

  async findAll(): Promise<RefreshToken[]> {
    const result = await this.prisma.refreshToken.findMany();
    return result as RefreshToken[];
  }

  async deleteById(id: string): Promise<RefreshToken> {
    const result = await this.prisma.refreshToken.delete({
      where: { id },
    });
    return result as RefreshToken;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
