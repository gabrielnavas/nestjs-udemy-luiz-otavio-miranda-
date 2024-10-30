import { HashingService } from 'src/auth/hashing/hashing.service';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dtos/create-user.dto';
import { Policy } from 'src/auth/enums/route-policies.enum';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let userService: UsersService;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn().mockResolvedValue('HASH_PASSWORD'),
          },
        },
      ],
    }).compile();
    userService = module.get(UsersService);
    hashingService = module.get(HashingService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(hashingService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      //  Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: '12345678',
      };
      jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_PASSWORD');

      //  Act
      const result = await userService.createUser(createUserDto);

      //   Assert
      expect(hashingService.hash).toHaveBeenCalledTimes(1);
      expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);

      expect(result).toBeDefined();
      expect(typeof result.id === 'string').toBeTruthy();
      expect(result.email).toEqual(createUserDto.email);
      expect(result.policies).toEqual([
        Policy.user,
        Policy.findUserById,
        Policy.deleteUser,
        Policy.findAllUsers,
        Policy.findUsers,
      ]);
    });

    it('should throws a unique user email error when create a new user', async () => {
      //  Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: '12345678',
      };

      //  Act
      await userService.createUser({
        email: 'test@example.com',
        password: '12345678',
      });
      const result = userService.createUser({
        email: 'test@example.com',
        password: '12345678',
      });

      //  Assert
      expect(result).rejects.toThrow(
        new Error('Usuário já cadastrado com esse e-mail.'),
      );
    });

    it('should throws a hashing error when create a new user', async () => {
      //  Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: '12345678',
      };
      const hashingError = new Error('any error hash password');
      jest.spyOn(hashingService, 'hash').mockRejectedValue(hashingError);

      //  Act
      const result = userService.createUser(createUserDto);

      //   Assert
      expect(result).rejects.toThrow(hashingError);
    });
  });

  describe('findUserById', () => {
    it('should return an user', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@email.com',
        password: '12345678',
      };
      
      // Act
      await userService.createUser(createUserDto);
      const result = await userService.findUserById('1');

      // Assert
      expect(result).toBeDefined();
      expect(typeof result.id === 'string').toBeTruthy();
      expect(result.email).toEqual(createUserDto.email);
      expect(result.policies).toEqual([
        Policy.user,
        Policy.findUserById,
        Policy.deleteUser,
        Policy.findAllUsers,
        Policy.findUsers,
      ]);
    });

    it('should throw an error if there is no user', async () => {
      // Arrange
      // Act
      const result = userService.findUserById('123');
      // Assert
      expect(result).rejects.toEqual(new NotFoundException('User not found.'));
    });
  });
});
