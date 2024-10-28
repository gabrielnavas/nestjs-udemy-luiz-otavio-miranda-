import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { Request } from 'express';
import { FindUsersDto } from './dtos/find-users.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findUserById(
    @Param('id') userId: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    console.log(tokenPayload);
    return await this.userService.findUserById(userId);
  }

  @UseGuards(AuthTokenGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findUsers(
    @Query() dto: FindUsersDto,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    console.log(tokenPayload);
    return await this.userService.findUsers(dto);
  }
}
