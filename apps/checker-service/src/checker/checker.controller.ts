import { Controller, Post, Body } from '@nestjs/common';
import { CheckerService } from './checker.service';
import { CheckDto } from './dto/check.dto';
import { CheckResultDto } from './dto/check-result.dto';

@Controller('check')
export class CheckerController {
  constructor(private readonly checkerService: CheckerService) {}

  @Post()
  async checkCode(@Body() checkDto: CheckDto): Promise<CheckResultDto> {
    return this.checkerService.checkCode(checkDto);
  }
}
