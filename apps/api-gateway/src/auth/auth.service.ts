import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppConfigService } from '../config/config.service';
import { firstValueFrom } from 'rxjs';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../common/dto/user.dto';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  VerifyTokenDto,
} from './dto/auth.dto';

interface ErrorResponse {
  error?: {
    message?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  private get authServiceUrl(): string {
    return this.configService.authServiceUrl;
  }

  private getErrorStatus(error: unknown): number | undefined {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { status?: number } }).response;
      return response?.status;
    }
    return undefined;
  }

  private getErrorResponse(error: unknown): ErrorResponse | null {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response?: { data?: ErrorResponse } })
        .response;
      return response?.data || null;
    }
    return null;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ success: true; data: UserResponseDto }>(
          `${this.authServiceUrl}/users`,
          createUserDto,
        ),
      );
      return data.data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 409) {
        throw new HttpException(
          errorResponse?.error?.message ||
            'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      if (status === 400) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid input data',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to create user',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ success: true; data: UserResponseDto[] }>(
          `${this.authServiceUrl}/users`,
        ),
      );
      return data.data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to fetch users',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserById(id: string): Promise<UserResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<{ success: true; data: UserResponseDto }>(
          `${this.authServiceUrl}/users/${id}`,
        ),
      );
      return data.data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 404) {
        throw new HttpException(
          errorResponse?.error?.message || 'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to fetch user',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch<{ success: true; data: UserResponseDto }>(
          `${this.authServiceUrl}/users/${id}`,
          updateUserDto,
        ),
      );
      return data.data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 404) {
        throw new HttpException(
          errorResponse?.error?.message || 'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      if (status === 409) {
        throw new HttpException(
          errorResponse?.error?.message ||
            'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      if (status === 400) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid input data',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to update user',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete(`${this.authServiceUrl}/users/${id}`),
      );
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 404) {
        throw new HttpException(
          errorResponse?.error?.message || 'User not found',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to delete user',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<AuthResponseDto>(
          `${this.authServiceUrl}/auth/login`,
          loginDto,
        ),
      );
      return data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 401) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid credentials',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (status === 400) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid input data',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to login',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<AuthResponseDto>(
          `${this.authServiceUrl}/auth/register`,
          registerDto,
        ),
      );
      return data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 409) {
        throw new HttpException(
          errorResponse?.error?.message ||
            'User with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      if (status === 400) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid input data',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to register user',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyToken(
    verifyTokenDto: VerifyTokenDto,
  ): Promise<{ valid: boolean; payload: unknown }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ valid: boolean; payload: unknown }>(
          `${this.authServiceUrl}/auth/verify`,
          verifyTokenDto,
        ),
      );
      return data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 401) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to verify token',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<AuthResponseDto>(
          `${this.authServiceUrl}/auth/refresh`,
          { refreshToken },
        ),
      );
      return data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 401) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to refresh token',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(token: string): Promise<UserResponseDto> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<UserResponseDto>(
          `${this.authServiceUrl}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );
      return data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 401) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to get profile',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ message: string }>(
          `${this.authServiceUrl}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );
      return data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 401) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid token',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to logout',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(
    userId: string,
    updateProfileDto: any,
    token: string,
  ): Promise<{ user: UserResponseDto; accessToken: string }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch<{
          user: UserResponseDto;
          accessToken: string;
        }>(`${this.authServiceUrl}/auth/profile`, updateProfileDto, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      );
      return data;
    } catch (error: unknown) {
      const status = this.getErrorStatus(error);
      const errorResponse = this.getErrorResponse(error);

      if (status === 400) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid request data',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (status === 401) {
        throw new HttpException(
          errorResponse?.error?.message || 'Invalid token or current password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        errorResponse?.error?.message || 'Failed to update profile',
        status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
