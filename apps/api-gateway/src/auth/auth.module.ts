import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AppConfigService } from '../config/config.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, AppConfigService],
  exports: [AuthService],
})
export class AuthModule {}
