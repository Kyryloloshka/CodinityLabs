export const REFRESH_TOKEN_REPOSITORY = 'REFRESH_TOKEN_REPOSITORY';

export interface CreateRefreshTokenData {
  token: string;
  userId: string;
  expiresAt: Date;
}

export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IRefreshTokenRepository {
  create(data: CreateRefreshTokenData): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  findAll(): Promise<RefreshToken[]>;
  deleteById(id: string): Promise<RefreshToken>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}
