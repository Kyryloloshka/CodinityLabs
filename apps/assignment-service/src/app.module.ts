import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { AssignmentModule } from './assignments/assignment.module';
import { SubmissionModule } from './submissions/submission.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    PrismaModule,
    AssignmentModule,
    SubmissionModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
