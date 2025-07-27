import { User, UserRole } from '@prisma/client';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface CreateUserData {
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  role?: UserRole;
  name?: string;
}

export interface IUserRepository {
  create(data: CreateUserData): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<User>;
}
