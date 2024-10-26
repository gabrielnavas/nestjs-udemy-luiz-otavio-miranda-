import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
