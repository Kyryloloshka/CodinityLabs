import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AssignmentsController } from './assignments.controller';
import { SubmissionsController } from './submissions.controller';
import { AssignmentsService } from './assignments.service';

@Module({
  imports: [HttpModule],
  controllers: [AssignmentsController, SubmissionsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
