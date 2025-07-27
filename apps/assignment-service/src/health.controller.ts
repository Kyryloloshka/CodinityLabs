import { Controller, Get } from '@nestjs/common';
import { ApiResponseDto } from './common/dto/api-response.dto';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return ApiResponseDto.success(
      { status: 'ok', timestamp: new Date().toISOString() },
      'Assignment service is healthy',
    );
  }
}
