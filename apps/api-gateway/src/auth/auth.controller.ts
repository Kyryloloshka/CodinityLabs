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

@ApiTags('Користувачі (API Gateway)')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Створити нового користувача',
    description: 'Створює нового користувача через Auth Service',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Дані для створення користувача',
  })
  @ApiCreatedResponse({
    description: 'Користувача успішно створено',
    type: UserResponseDto,
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
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.authService.createUser(createUserDto);
  }

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
}
