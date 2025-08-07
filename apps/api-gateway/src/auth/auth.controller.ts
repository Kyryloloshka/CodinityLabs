import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Request } from 'express';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  VerifyTokenDto,
  ClientAuthResponseDto,
} from './dto/auth.dto';
import { UserResponseDto, UpdateUserDto } from '../common/dto/user.dto';
import {
  ApiSuccessResponseDto,
  ApiErrorResponseDto,
} from '../common/dto/api-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
  };
}

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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'Authenticate user and get access token',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Login credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'User authenticated',
    type: ApiSuccessResponseDto<ClientAuthResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: ApiErrorResponseDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ClientAuthResponseDto> {
    const result = await this.authService.login(loginDto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      user: result.user,
    };
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
    type: ApiSuccessResponseDto<ClientAuthResponseDto>,
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
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ClientAuthResponseDto> {
    const result = await this.authService.register(registerDto);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      user: result.user,
    };
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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh access token using refresh token from cookies',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: ApiSuccessResponseDto<ClientAuthResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
    type: ApiErrorResponseDto,
  })
  async refreshToken(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ClientAuthResponseDto> {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const result = await this.authService.refreshToken(refreshToken);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      tokenType: result.tokenType,
      expiresIn: result.expiresIn,
      user: result.user,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout',
    description: 'Logout user and invalidate refresh tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    type: ApiSuccessResponseDto<{ message: string }>,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
    type: ApiErrorResponseDto,
  })
  async logout(
    @Req() req: Request & { user: UserResponseDto },
  ): Promise<{ message: string }> {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return await this.authService.logout(token);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get current user profile using JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ApiSuccessResponseDto<UserResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing token',
    type: ApiErrorResponseDto,
  })
  getProfile(@Req() req: Request & { user: UserResponseDto }): UserResponseDto {
    console.log('API Gateway /users/profile req.user:', req.user);
    return req.user;
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update current user profile (name and/or password)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'New name',
          example: 'Іван Петренко',
        },
        currentPassword: {
          type: 'string',
          description: 'Current password (required for password change)',
          example: 'currentPassword123',
        },
        newPassword: {
          type: 'string',
          description: 'New password',
          example: 'newPassword123',
        },
        confirmPassword: {
          type: 'string',
          description: 'Password confirmation',
          example: 'newPassword123',
        },
      },
    },
    description: 'Profile update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ApiSuccessResponseDto<{
      user: UserResponseDto;
      accessToken: string;
    }>,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token or current password',
    type: ApiErrorResponseDto,
  })
  async updateProfile(
    @Req() req: Request & { user: UserResponseDto },
    @Body() updateProfileDto: any,
  ): Promise<{ user: UserResponseDto; accessToken: string }> {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    return this.authService.updateProfile(req.user.id, updateProfileDto, token);
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
}
