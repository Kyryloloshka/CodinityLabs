import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Request } from 'express';
import { UserInfo } from '../../common/types';

interface AuthenticatedRequest extends Request {
  user: UserInfo;
}

function isAxiosError(error: unknown): error is AxiosError<unknown> {
  return error instanceof AxiosError;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('AUTH_SERVICE_URL');
    if (!url) {
      throw new Error('AUTH_SERVICE_URL is not defined');
    }
    this.authServiceUrl = url;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Перевіряємо токен через auth service
      const response = await firstValueFrom(
        this.httpService.get<UserInfo>(`${this.authServiceUrl}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      // Додаємо користувача до request
      request.user = response.data;
      return true;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error('JWT Auth Error:', error.response?.data || error.message);
      } else {
        console.error('JWT Auth Error:', error);
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(
    request: AuthenticatedRequest,
  ): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
