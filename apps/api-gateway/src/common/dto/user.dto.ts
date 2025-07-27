import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Невірний формат email' })
  @IsNotEmpty({ message: "Email обов'язковий" })
  email: string;

  @ApiProperty({
    description: 'Пароль користувача',
    example: 'password123',
    minLength: 6,
  })
  @IsString({ message: 'Пароль має бути рядком' })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  @IsNotEmpty({ message: "Пароль обов'язковий" })
  password: string;

  @ApiProperty({
    description: 'Роль користувача',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  @IsEnum(UserRole, { message: 'Невірна роль користувача' })
  @IsNotEmpty({ message: "Роль обов'язкова" })
  role: UserRole;

  @ApiProperty({
    description: "Ім'я користувача",
    example: 'Іван Петренко',
  })
  @IsString({ message: "Ім'я має бути рядком" })
  @IsNotEmpty({ message: "Ім'я обов'язкове" })
  name: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email користувача',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Невірний формат email' })
  email?: string;

  @ApiProperty({
    description: 'Пароль користувача',
    example: 'password123',
    minLength: 6,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Пароль має бути рядком' })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password?: string;

  @ApiProperty({
    description: 'Роль користувача',
    enum: UserRole,
    example: UserRole.STUDENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Невірна роль користувача' })
  role?: UserRole;

  @ApiProperty({
    description: "Ім'я користувача",
    example: 'Іван Петренко',
    required: false,
  })
  @IsOptional()
  @IsString({ message: "Ім'я має бути рядком" })
  name?: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Унікальний ідентифікатор користувача',
    example: '3e8ba423-72cc-4aa0-a0db-93ef0b3c34b1',
  })
  id: string;

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
    description: "Ім'я користувача",
    example: 'Іван Петренко',
  })
  name: string;

  @ApiProperty({
    description: 'Дата створення користувача',
    example: '2025-07-27T11:00:31.909Z',
  })
  createdAt: string;
}
