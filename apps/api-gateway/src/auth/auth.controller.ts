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
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UpdateUserDto, UserResponseDto } from '../common/dto/user.dto';
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
    summary: 'Get all users',
    description: 'Get all users from Auth Service',
  })
  @ApiOkResponse({
    description: 'All users successfully retrieved',
    type: [UserResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.authService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get user by unique identifier from Auth Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Унікальний ідентифікатор користувача',
    example: '3e8ba423-72cc-4aa0-a0db-93ef0b3c34b1',
  })
  @ApiOkResponse({
    description: 'User successfully found',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.authService.findUserById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update existing user data through Auth Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique user identifier',
    example: '3e8ba423-72cc-4aa0-a0db-93ef0b3c34b1',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Data to update user',
  })
  @ApiOkResponse({
    description: 'User successfully updated',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiConflictResponse({
    description: 'User with this email already exists',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
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
    summary: 'Delete user',
    description: 'Delete user by unique identifier through Auth Service',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique user identifier',
    example: '3e8ba423-72cc-4aa0-a0db-93ef0b3c34b1',
  })
  @ApiResponse({
    status: 204,
    description: 'User successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.authService.deleteUser(id);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'Login user by email and password',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login data',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: ApiSuccessResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
    type: ApiErrorResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register',
    description: 'Create new user account',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Registration data',
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: ApiSuccessResponseDto<AuthResponseDto>,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
    type: ApiErrorResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Token verification',
    description: 'Check the validity of the JWT token',
  })
  @ApiBody({
    type: VerifyTokenDto,
    description: 'Data for token verification',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid',
    type: ApiSuccessResponseDto<{ valid: boolean; payload: unknown }>,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
    type: ApiErrorResponseDto,
  })
  async verifyToken(
    @Body() verifyTokenDto: VerifyTokenDto,
  ): Promise<{ valid: boolean; payload: unknown }> {
    return this.authService.verifyToken(verifyTokenDto);
  }
}
