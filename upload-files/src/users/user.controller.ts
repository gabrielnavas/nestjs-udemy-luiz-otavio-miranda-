import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
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

@Controller({ path: 'users' })
export class UserController {
  constructor(
    private readonly userService: UsersService,

  ) {}

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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * (1024 * 1024) }),

          // Aceita JPEG, JPG, PNG, GIF e BMP
          // mas ainda não é suficiente
          // precisa ter alguma biblioteca pra ler o buffer e tentar ver que tipo arquivo é
          // vou usar o file-type como lib de exemplo
          new FileTypeValidator({ fileType: /(jpeg|jpg|png|gif|bmp)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return await this.userService.uploadPicture(file, tokenPayload)
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
    await this.userService.uploadPictures(files, tokenPayload)
  }
}
