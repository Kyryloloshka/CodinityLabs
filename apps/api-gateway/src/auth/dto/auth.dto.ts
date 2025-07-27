import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

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
    description: 'Тип токена',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'Час життя токена в секундах',
    example: 3600,
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

export class VerifyTokenDto {
  @ApiProperty({
    description: 'JWT токен для верифікації',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Токен має бути рядком' })
  token: string;
}
