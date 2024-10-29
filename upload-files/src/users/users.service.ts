import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Policy } from 'src/auth/enums/route-policies.enum';

import * as path from 'path';
import * as fs from 'fs/promises';
import { FileService } from 'src/shared/file.service';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  constructor(
    private readonly hashingService: HashingService,
    private readonly fileService: FileService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const userPolicies = [
      Policy.user,
      Policy.findUserById,
      Policy.deleteUser,
      Policy.findAllUsers,
      Policy.findUsers,
    ];
    const user = new User();
    user.id = (this.users.length + 1).toString();
    user.email = dto.email;
    user.passwordHash = await this.hashingService.hash(dto.password);
    user.active = true;
    user.policies = userPolicies;
    this.users.push(user);

    return {
      id: user.id,
      email: user.email,
      policies: user.policies,
    };
  }

  async findUserById(id: string) {
    const userIndex = this.users.findIndex((user) => (user.id = id));
    if (userIndex < 0) {
      throw new NotFoundException('User not found.');
    }
    const user = this.users[userIndex];
    return {
      id: user.id,
      email: user.email,
      active: user.active,
      policies: user.policies,
    };
  }

  async findUserByEmail(email: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.email === email);
    if (userIndex < 0) {
      throw new NotFoundException('User not found.');
    }
    return this.users[userIndex];
  }

  async uploadPicture(
    file: Express.Multer.File,
    tokenPayload: TokenPayloadDto,
  ) {
    const isImage = await this.fileService.validateImage(file.buffer);
    if (!isImage) {
      throw new BadRequestException('Arquivo não é do tipo imagem');
    }

    if (file.size < 1024) {
      throw new BadRequestException('Imagem é muito pequena.');
    }

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

  async uploadPictures(
    files: Express.Multer.File[],
    tokenPayload: TokenPayloadDto,
  ) {
    files.forEach(async (file) => {
      const isImage = await this.fileService.validateImage(file.buffer);
      if (!isImage) {
        throw new BadRequestException('Arquivo não é do tipo imagem');
      }
      if (file.size < 1024) {
        throw new BadRequestException('Imagem é muito pequena.');
      }

      const fileExtension = path
        .extname(file.originalname)
        .toLocaleLowerCase()
        .substring(1);

      const fileName = `${tokenPayload.sub}:${randomUUID()}:${Date.now()}`;

      const fullFileName = `${fileName}.${fileExtension}`;

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
