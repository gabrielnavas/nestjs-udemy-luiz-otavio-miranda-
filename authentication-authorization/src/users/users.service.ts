import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUser } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  createUser = async (dto: CreateUser): Promise<UserDto> => {
    const user = new User();
    user.email = dto.email;
    user.passwordHash = dto.password;
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
