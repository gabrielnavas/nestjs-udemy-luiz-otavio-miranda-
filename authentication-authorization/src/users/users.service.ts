import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUser } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  constructor(private readonly hashingService: HashingService) {}

  createUser = async (dto: CreateUser): Promise<UserDto> => {
    const user = new User();
    user.email = dto.email;
    user.passwordHash = await this.hashingService.hash(dto.password);
    this.users.push(user);

    return {
      id: user.id,
      email: user.email,
    };
  };

  findUserById = async (id: string) => {
    const userIndex = this.users.findIndex((user) => (user.id = id));
    if (userIndex < 0) {
      throw new NotFoundException('User not found.');
    }
    const user = this.users[userIndex];
    return {
      id: user.id,
      email: user.email,
    };
  };
}
