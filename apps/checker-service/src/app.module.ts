import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckerModule } from './checker/checker.module';

@Module({
  imports: [CheckerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
