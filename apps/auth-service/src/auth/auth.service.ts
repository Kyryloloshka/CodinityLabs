import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RefreshTokenDto,
} from '../common/dto/auth.dto';
import { CreateUserDto } from '../common/dto/user.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { AppConfigService } from '../config/config.service';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY,
} from './interfaces/refresh-token.repository.interface';

interface ValidatedUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<ValidatedUser | null> {
    try {
      const user = await this.usersService.findByEmailWithPassword(email);
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    } catch {
      return null;
    }
  }

  private generateTokens(user: ValidatedUser) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.jwtAccessExpiresIn,
      secret: this.configService.jwtAccessSecret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.jwtRefreshExpiresIn,
      secret: this.configService.jwtRefreshSecret,
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      token: hashedToken,
      userId,
      expiresAt,
    });
  }

  private async validateAndDeleteRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    // Знаходимо всі refresh tokens і перевіряємо кожен
    const allRefreshTokens = await this.refreshTokenRepository.findAll();

    for (const tokenRecord of allRefreshTokens) {
      const isValid = await bcrypt.compare(refreshToken, tokenRecord.token);
      if (isValid && tokenRecord.expiresAt > new Date()) {
        await this.refreshTokenRepository.deleteById(tokenRecord.id);
        return tokenRecord.userId;
      }
    }

    throw new UnauthorizedException('Invalid or expired refresh token');
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const createUserDto: CreateUserDto = {
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
      role: registerDto.role,
    };

    console.log(createUserDto);
    const user = await this.usersService.create(createUserDto);

    const { accessToken, refreshToken } = this.generateTokens(user);

    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 900,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    try {
      const userId = await this.validateAndDeleteRefreshToken(
        refreshTokenDto.refreshToken,
      );

      const user = await this.usersService.findOne(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { accessToken, refreshToken } = this.generateTokens(user);

      await this.saveRefreshToken(user.id, refreshToken);

      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 900,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  verifyToken(token: string): JwtPayload {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.jwtAccessSecret,
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.refreshTokenRepository.deleteByUserId(userId);
  }
}
