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

  get authServiceUrl(): string {
    return this.configService.get<string>('AUTH_SERVICE_URL')!;
  }

  get assignmentServiceUrl(): string {
    return this.configService.get<string>('ASSIGNMENT_SERVICE_URL')!;
  }

  get checkerServiceUrl(): string {
    return this.configService.get<string>('CHECKER_SERVICE_URL')!;
  }
}
