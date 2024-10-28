import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUser } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { Request } from 'express';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUser) {
    return await this.userService.createUser(dto);
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findUserById(@Param('id') userId: string, @Req () req: Request) {
    console.log(req.userId);
    return await this.userService.findUserById(userId);
  }
}
