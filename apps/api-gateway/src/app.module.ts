import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { AppConfigService } from './config/config.service';
import { envValidationSchema } from './config/env.validation';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env.development.local',
        '.env.production.local',
        '.env.test.local',
        '.env',
      ],
      validationSchema: envValidationSchema,
    }),
    TerminusModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
