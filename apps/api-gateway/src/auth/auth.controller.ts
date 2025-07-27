import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../common/dto/user.dto';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  VerifyTokenDto,
} from './dto/auth.dto';
import {
  ApiSuccessResponseDto,
  ApiErrorResponseDto,
} from '../common/dto/api-response.dto';

@ApiTags('Auth')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiOperation({
    summary: 'Отримати всіх користувачів',
    description: 'Повертає список всіх користувачів через Auth Service',
  })
  @ApiOkResponse({
    description: 'Список користувачів успішно отримано',
    type: [UserResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутрішня помилка сервера',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.authService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Отримати користувача за ID',
    description:
      'Повертає користувача за унікальним ідентифікатором через Auth Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор користувача',
    example: '3e8ba423-72cc-4aa0-a0db-93ef0b3c34b1',
  })
  @ApiOkResponse({
    description: 'Користувача успішно знайдено',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Користувача не знайдено',
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутрішня помилка сервера',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.authService.findUserById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Оновити користувача',
    description: 'Оновлює дані існуючого користувача через Auth Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор користувача',
    example: '3e8ba423-72cc-4aa0-a0db-93ef0b3c34b1',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Дані для оновлення користувача',
  })
  @ApiOkResponse({
    description: 'Користувача успішно оновлено',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Користувача не знайдено',
  })
  @ApiConflictResponse({
    description: 'Користувач з таким email вже існує',
  })
  @ApiBadRequestResponse({
    description: 'Невірні дані запиту',
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутрішня помилка сервера',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Видалити користувача',
    description:
      'Видаляє користувача за унікальним ідентифікатором через Auth Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор користувача',
    example: '3e8ba423-72cc-4aa0-a0db-93ef0b3c34b1',
  })
  @ApiResponse({
    status: 204,
    description: 'Користувача успішно видалено',
  })
  @ApiNotFoundResponse({
    description: 'Користувача не знайдено',
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутрішня помилка сервера',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.authService.deleteUser(id);
  }

  // Авторизаційні ендпоінти
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

  @Post('verify')
  @ApiOperation({
    summary: 'Верифікація токена',
    description: 'Перевірка валідності JWT токена',
  })
  @ApiBody({
    type: VerifyTokenDto,
    description: 'Дані для верифікації токена',
  })
  @ApiResponse({
    status: 200,
    description: 'Токен валідний',
    type: ApiSuccessResponseDto<{ valid: boolean; payload: unknown }>,
  })
  @ApiResponse({
    status: 401,
    description: 'Невірний токен',
    type: ApiErrorResponseDto,
  })
  async verifyToken(
    @Body() verifyTokenDto: VerifyTokenDto,
  ): Promise<{ valid: boolean; payload: unknown }> {
    return this.authService.verifyToken(verifyTokenDto);
  }
}
