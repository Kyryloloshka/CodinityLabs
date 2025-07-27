import {
  Controller,
  Get,
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
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto } from '../common/dto/user.dto';
import {
  UserSuccessResponseDto,
  UsersListSuccessResponseDto,
  ApiErrorResponseDto,
} from '../common/dto/api-response.dto';
import { ApiSuccessResponse } from '../common/interfaces/error.interface';

@ApiTags('Користувачі')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Отримати всіх користувачів',
    description: 'Повертає список всіх користувачів у системі',
  })
  @ApiOkResponse({
    description: 'Список користувачів успішно отримано',
    type: UsersListSuccessResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутрішня помилка сервера',
    type: ApiErrorResponseDto,
  })
  async findAll(): Promise<ApiSuccessResponse<UserResponseDto[]>> {
    const users = await this.usersService.findAll();
    return {
      success: true,
      data: users,
      message: 'Список користувачів успішно отримано',
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Отримати користувача за ID',
    description: 'Повертає користувача за унікальним ідентифікатором',
  })
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор користувача',
    example: '3e8ba423-72cc-4aa0-a0db-93ef0b3c34b1',
  })
  @ApiOkResponse({
    description: 'Користувача успішно знайдено',
    type: UserSuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Користувача не знайдено',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутрішня помилка сервера',
    type: ApiErrorResponseDto,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiSuccessResponse<UserResponseDto>> {
    const user = await this.usersService.findOne(id);
    return {
      success: true,
      data: user,
      message: 'Користувача успішно знайдено',
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Оновити користувача',
    description: 'Оновлює дані існуючого користувача',
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
    type: UserSuccessResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Користувача не знайдено',
    type: ApiErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Користувач з таким email вже існує',
    type: ApiErrorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Невірні дані запиту',
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутрішня помилка сервера',
    type: ApiErrorResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiSuccessResponse<UserResponseDto>> {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      data: user,
      message: 'Користувача успішно оновлено',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Видалити користувача',
    description: 'Видаляє користувача за унікальним ідентифікатором',
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
    type: ApiErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутрішня помилка сервера',
    type: ApiErrorResponseDto,
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
