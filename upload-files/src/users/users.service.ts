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
import { Policy } from 'src/auth/enums/route-policies.enum';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  constructor(private readonly hashingService: HashingService) {}

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
}
