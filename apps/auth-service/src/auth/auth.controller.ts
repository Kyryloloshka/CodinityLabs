import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  RefreshTokenDto,
} from '../common/dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiSuccessResponseDto,
  ApiErrorResponseDto,
} from '../common/dto/api-response.dto';

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Вхід в систему',
    description: 'Авторизація користувача за email та паролем',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Дані для входу',
  })
  @ApiResponse({
    status: 200,
    description: 'Успішний вхід',
    type: ApiSuccessResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Невірні облікові дані',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Невірні дані запиту',
    type: ApiErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Реєстрація користувача',
    description: 'Створення нового облікового запису',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Дані для реєстрації',
  })
  @ApiResponse({
    status: 201,
    description: 'Користувача створено',
    type: ApiSuccessResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 409,
    description: 'Користувач з таким email вже існує',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Невірні дані запиту',
    type: ApiErrorResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Оновити токен доступу',
    description: 'Отримання нового access token за допомогою refresh token',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh токен',
  })
  @ApiResponse({
    status: 200,
    description: 'Токен оновлено',
    type: ApiSuccessResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Невірний refresh токен',
    type: ApiErrorResponseDto,
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Вихід з системи',
    description: 'Видалення refresh token користувача',
  })
  @ApiResponse({
    status: 200,
    description: 'Успішний вихід',
    type: ApiSuccessResponseDto<{ message: string }>,
  })
  @ApiResponse({
    status: 401,
    description: 'Невірний токен',
    type: ApiErrorResponseDto,
  })
  async logout(
    @Request() req: { user: { sub: string } },
  ): Promise<{ message: string }> {
    await this.authService.logout(req.user.sub);
    return { message: 'Успішний вихід з системи' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Отримати профіль користувача',
    description: 'Отримання інформації про поточного користувача',
  })
  @ApiResponse({
    status: 200,
    description: 'Профіль користувача',
    type: ApiSuccessResponseDto<{
      id: string;
      email: string;
      name: string;
      role: string;
    }>,
  })
  @ApiResponse({
    status: 401,
    description: 'Невірний токен',
    type: ApiErrorResponseDto,
  })
  getProfile(@Request() req: { user: unknown }) {
    return req.user;
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Верифікація токена',
    description: 'Перевірка валідності JWT токена',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'JWT токен для верифікації',
        },
      },
      required: ['token'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Токен валідний',
    type: ApiSuccessResponseDto<{
      valid: boolean;
      payload: unknown;
    }>,
  })
  @ApiResponse({
    status: 401,
    description: 'Невірний токен',
    type: ApiErrorResponseDto,
  })
  verifyToken(@Body() body: { token: string }) {
    const payload = this.authService.verifyToken(body.token);
    return {
      valid: true,
      payload,
    };
  }
}
