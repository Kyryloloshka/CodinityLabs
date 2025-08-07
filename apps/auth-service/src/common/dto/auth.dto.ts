import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { UserRole } from '@prisma/client';

export class LoginDto {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Невірний формат email' })
  email: string;

  @ApiProperty({
    description: 'Пароль користувача',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'Пароль має бути рядком' })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Невірний формат email' })
  email: string;

  @ApiProperty({
    description: 'Пароль користувача',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'Пароль має бути рядком' })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password: string;

  @ApiProperty({
    description: "Ім'я користувача",
    example: 'Іван Петренко',
  })
  @IsString({ message: "Ім'я має бути рядком" })
  name: string;

  @ApiProperty({
    description: 'Роль користувача',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  @IsEnum(UserRole, { message: 'Невірна роль користувача' })
  role: UserRole;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT токен доступу',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh токен',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Тип токена',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Час життя токена в секундах',
    example: 900,
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Інформація про користувача',
  })
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh токен',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Refresh токен має бути рядком' })
  refreshToken: string;
}

export class TokenPayloadDto {
  @ApiProperty({
    description: 'ID користувача',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sub: string;

  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Роль користувача',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Час створення токена',
    example: 1640995200,
  })
  iat: number;

  @ApiProperty({
    description: 'Час закінчення токена',
    example: 1640998800,
  })
  exp: number;
}

export class UpdateProfileDto {
  @ApiProperty({
    description: "Ім'я користувача",
    example: 'Іван Петренко',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Ім'я має бути рядком" })
  @MinLength(2, { message: "Ім'я має бути не менше 2 символів" })
  name?: string;

  @ApiProperty({
    description: 'Поточний пароль (обов\'язковий для зміни паролю)',
    example: 'currentPassword123',
    required: false,
  })
  @ValidateIf((o) => o.newPassword !== undefined)
  @IsString({ message: 'Поточний пароль має бути рядком' })
  currentPassword?: string;

  @ApiProperty({
    description: 'Новий пароль',
    example: 'newPassword123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Новий пароль має бути рядком' })
  @MinLength(6, { message: 'Новий пароль має бути не менше 6 символів' })
  newPassword?: string;

  @ApiProperty({
    description: 'Підтвердження нового паролю',
    example: 'newPassword123',
    required: false,
  })
  @ValidateIf((o) => o.newPassword !== undefined)
  @IsString({ message: 'Підтвердження паролю має бути рядком' })
  confirmPassword?: string;
}
