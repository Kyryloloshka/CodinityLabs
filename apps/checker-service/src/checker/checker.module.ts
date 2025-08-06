import { Module } from '@nestjs/common';
import { CheckerController } from './checker.controller';
import { CheckerService } from './checker.service';
import { SafeCodeExecutorService } from './safe-code-executor.service';

@Module({
  controllers: [CheckerController],
  providers: [CheckerService, SafeCodeExecutorService],
})
export class CheckerModule {}
