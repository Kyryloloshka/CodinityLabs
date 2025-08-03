import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('PORT')!;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV')!;
  }

  get jwtAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET')!;
  }

  get jwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET')!;
  }

  get jwtAccessExpiresIn(): string {
    return this.configService.get<string>('JWT_ACCESS_EXPIRES_IN')!;
  }

  get jwtRefreshExpiresIn(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')!;
  }
}
