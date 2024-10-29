import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { FindUsersDto } from './dtos/find-users.dto';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { Policy } from 'src/auth/enums/route-policies.enum';
import { AuthTokenAndPolicyGuard } from 'src/auth/guards/auth-token-and-policy.guard';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @SetRoutePolicy(Policy.deleteUser)
  @UseGuards(AuthTokenAndPolicyGuard)
  @Post('upload-picture')
  @HttpCode(HttpStatus.NO_CONTENT)
  async uploadPicture(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    console.log('opa!');
    
    return true;
  }
}
