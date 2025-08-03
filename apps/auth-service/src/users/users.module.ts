import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaRefreshTokenRepository } from '../auth/repositories/prisma-refresh-token.repository';
import { USER_REPOSITORY } from './interfaces/user.repository.interface';
import { REFRESH_TOKEN_REPOSITORY } from '../auth/interfaces/refresh-token.repository.interface';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
  exports: [UsersService, USER_REPOSITORY, REFRESH_TOKEN_REPOSITORY],
})
export class UsersModule {}
