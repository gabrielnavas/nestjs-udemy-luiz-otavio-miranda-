import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUser } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUser) {
    return await this.userService.createUser(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findUserById(@Param('id') userId: string) {
    return await this.userService.findUserById(userId);
  }
}
