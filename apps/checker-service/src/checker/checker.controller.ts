import { Controller, Post, Body } from '@nestjs/common';
import { CheckerService } from './checker.service';
import { CheckDto } from './dto/check.dto';
import { CheckResultDto } from './dto/check-result.dto';

@Controller('check')
export class CheckerController {
  constructor(private readonly checkerService: CheckerService) {}

  @Post()
  async checkCode(@Body() checkDto: CheckDto): Promise<CheckResultDto> {
    console.log('🔍 Checker Service: Received check request', {
      hasCode: !!checkDto.code,
      language: checkDto.language,
      testCasesCount: checkDto.testCases?.length,
      hasSettings: !!checkDto.settings,
    });

    try {
      const result = await this.checkerService.checkCode(checkDto);
      console.log('✅ Checker Service: Check completed successfully');
      return result;
    } catch (error) {
      console.error('❌ Checker Service: Check failed', error);
      throw error;
    }
  }
}
