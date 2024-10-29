import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { SetRoutePolicy } from 'src/auth/decorators/set-route-policy.decorator';
import { Policy } from 'src/auth/enums/route-policies.enum';
import { AuthTokenAndPolicyGuard } from 'src/auth/guards/auth-token-and-policy.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { Express } from 'express';

import * as path from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';

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
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-picture')
  @HttpCode(HttpStatus.CREATED)
  async uploadPicture(
    @UploadedFile() file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    const fileExtension = path
      .extname(file.originalname)
      .toLocaleLowerCase()
      .substring(1);
    const fileName = `${tokenPayload.sub}.${fileExtension}`;

    const fileFullPath = path.resolve(
      process.cwd(),
      'pictures',
      'users',
      fileName,
    );
    await fs.writeFile(fileFullPath, file.buffer);

    return {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @SetRoutePolicy(Policy.deleteUser)
  @UseGuards(AuthTokenAndPolicyGuard)
  @UseInterceptors(FilesInterceptor('file'))
  @Post('upload-pictures')
  @HttpCode(HttpStatus.NO_CONTENT)
  async uploadPictures(
    @UploadedFiles() files: Express.Multer.File[],
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    files.forEach(async (file) => {
      const fileExtension = path
        .extname(file.originalname)
        .toLocaleLowerCase()
        .substring(1);

      const fileName = `${tokenPayload.sub}:${randomUUID()}:${Date.now()}`;

      const fullFileName = `${fileName}.${fileExtension}`

      const fileFullPath = path.resolve(
        process.cwd(),
        'pictures',
        'users',
        fullFileName,
      );
      await fs.writeFile(fileFullPath, file.buffer);
    });
  }
}
