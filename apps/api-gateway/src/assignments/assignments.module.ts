import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AssignmentsController } from './assignments.controller';
import { SubmissionsController } from './submissions.controller';
import { AssignmentsService } from './assignments.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [AssignmentsController, SubmissionsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
