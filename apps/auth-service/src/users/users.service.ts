import { Injectable, Inject } from '@nestjs/common';
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
  USER_REPOSITORY,
} from './interfaces/user.repository.interface';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '../common/dto/user.dto';
import { User } from '@prisma/client';
import {
  UserNotFoundException,
  UserAlreadyExistsException,
  DatabaseException,
} from '../common/exceptions/custom.exceptions';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const existingUser = await this.userRepository.findByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new UserAlreadyExistsException(createUserDto.email);
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const createUserData: CreateUserData = {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
        name: createUserDto.name,
      };

      const user = await this.userRepository.create(createUserData);
      return this.mapToUserResponse(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw error;
      }
      throw new DatabaseException('create user', error);
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.findAll();
      return users.map(user => this.mapToUserResponse(user));
    } catch (error) {
      throw new DatabaseException('find all users', error);
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    try {
      console.log('UsersService.findOne - searching for id:', id);
      const user = await this.userRepository.findById(id);
      console.log('UsersService.findOne - found user:', user);

      if (!user) {
        throw new UserNotFoundException(id);
      }
      return this.mapToUserResponse(user);
    } catch (error) {
      console.error('UsersService.findOne - error:', error);
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new DatabaseException('find user by id', error);
    }
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user ? this.mapToUserResponse(user) : null;
    } catch (error) {
      throw new DatabaseException('find user by email', error);
    }
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      throw new DatabaseException('find user by email with password', error);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new UserNotFoundException(id);
      }

      if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
        const userWithEmail = await this.userRepository.findByEmail(
          updateUserDto.email,
        );
        if (userWithEmail) {
          throw new UserAlreadyExistsException(updateUserDto.email);
        }
      }

      const updateUserData: UpdateUserData = {
        email: updateUserDto.email,
        password: updateUserDto.password,
        role: updateUserDto.role,
        name: updateUserDto.name,
      };

      const user = await this.userRepository.update(id, updateUserData);
      return this.mapToUserResponse(user);
    } catch (error) {
      if (
        error instanceof UserNotFoundException ||
        error instanceof UserAlreadyExistsException
      ) {
        throw error;
      }
      throw new DatabaseException('update user', error);
    }
  }

  async remove(id: string): Promise<UserResponseDto> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new UserNotFoundException(id);
      }

      const user = await this.userRepository.delete(id);
      return this.mapToUserResponse(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw error;
      }
      throw new DatabaseException('delete user', error);
    }
  }

  private mapToUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
