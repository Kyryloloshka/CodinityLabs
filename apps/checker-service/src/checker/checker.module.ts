import { Module } from '@nestjs/common';
import { CheckerController } from './checker.controller';
import { CheckerService } from './checker.service';

@Module({
  controllers: [CheckerController],
  providers: [CheckerService],
})
export class CheckerModule {}
