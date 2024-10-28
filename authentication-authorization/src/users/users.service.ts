import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { FindUsersDto } from './dtos/find-users.dto';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  constructor(private readonly hashingService: HashingService) {}

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const user = new User();
    user.id = (this.users.length + 1).toString();
    user.email = dto.email;
    user.passwordHash = await this.hashingService.hash(dto.password);
    this.users.push(user);

    return {
      id: user.id,
      email: user.email,
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
    };
  }

  async deleteUserById(tokenPayload: TokenPayloadDto, userId: string) {
    const userIndex = this.users.findIndex((user) => (user.id = userId));
    if (userIndex < 0) {
      throw new NotFoundException('User not found.');
    }
    if (tokenPayload.sub !== userId) {
      throw new UnauthorizedException('You dont have permission for this.');
    }
    this.users.splice(userIndex, 1);
  }

  async findUsers({ page, size }: FindUsersDto): Promise<UserDto[]> {
    const users = this.users.slice((page - 1) * size, page * size);
    return users.map((user) => ({
      id: user.id,
      email: user.email,
    }));
  }

  async findUserByEmail(email: string): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.email === email);
    if (userIndex < 0) {
      throw new NotFoundException('User not found.');
    }
    return this.users[userIndex];
  }
}
