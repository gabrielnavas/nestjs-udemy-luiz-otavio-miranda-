import { HashingService } from 'src/auth/hashing/hashing.service';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dtos/create-user.dto';
import { Policy } from 'src/auth/enums/route-policies.enum';
import { NotFoundException } from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';

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
            hash: jest.fn(),
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

  describe('deleteUserById', () => {
    it('should  delete an user', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@email.com',
        password: '12345678',
      };
      const userId = '1';
      const tokenPayloadDto: TokenPayloadDto = {
        aud: '1',
        email: '1',
        exp: 1,
        iat: 1,
        iss: '1',
        sub: '1',
      };

      // Act
      await userService.createUser(createUserDto);
      const result = userService.deleteUserById(tokenPayloadDto, userId);

      // Assert
      expect(result).resolves.toEqual(undefined);
    });

    it('should throws an error user not found', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@email.com',
        password: '12345678',
      };
      const userId = '1';
      const tokenPayloadDto: TokenPayloadDto = {
        aud: '1',
        email: '1',
        exp: 1,
        iat: 1,
        iss: '1',
        sub: '1',
      };

      // Act
      const result = userService.deleteUserById(tokenPayloadDto, userId);

      // Assert
      expect(result).rejects.toThrow(new Error('User not found.'));
    });

    it('should throws an error not permission', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@email.com',
        password: '12345678',
      };

      // other user try delete
      const userId = '2';
      const tokenPayloadDto: TokenPayloadDto = {
        aud: '1',
        email: '1',
        exp: 1,
        iat: 1,
        iss: '1',
        sub: '1',
      };

      // Act
      await userService.createUser(createUserDto);
      const result = userService.deleteUserById(tokenPayloadDto, userId);

      // Assert
      expect(result).rejects.toThrow(
        new Error('You dont have permission for this.'),
      );
    });
  });

  describe('findUserByEmail', () => {
    it('should return an user', async () => {
      // Arrange
      const email = 'test@email.com';
      const createUserDto = {
        email,
        password: '12345678',
      };

      // Act
      await userService.createUser(createUserDto);
      const result = await userService.findUserByEmail(email);

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
      const result = userService.findUserByEmail('any@email.com');
      // Assert
      expect(result).rejects.toEqual(new NotFoundException('User not found.'));
    });
  });

  describe('findUsers', () => {
    it('should return many users', async () => {
      // Arrange
      const createUserDtos = new Array(11).fill('').map((_, index) => ({
        email: `test${index}@email.com`,
        password: '12345678',
      }));

      // Act
      createUserDtos.forEach((dto) => userService.createUser(dto));
      const users = await userService.findUsers({ page: 1, size: 10 });

      // Assert
      expect(users).toBeDefined();
      expect(typeof users === 'object').toBeTruthy();
      users.forEach((user, index) => {
        expect(typeof user.id === 'string').toBeTruthy();
        expect(user.email).toEqual(`test${index}@email.com`);
        expect(user.policies).toEqual([
          Policy.user,
          Policy.findUserById,
          Policy.deleteUser,
          Policy.findAllUsers,
          Policy.findUsers,
        ]);
      });
    });

    it('should throws an error if page is 0 or less', async () => {
      // Act
      const promise =  userService.findUsers({ page: 0, size: 10 });

      // Assert
      expect(promise).rejects.toThrow(new Error('Page should by greater than 0.'));
    });

    
    it('should throws an error if size is 0 or less', async () => {
      // Act
      const promise =  userService.findUsers({ page: 1, size: 0 });

      // Assert
      expect(promise).rejects.toThrow(new Error('Size should by greate than 0.'));
    });

      
    it('should throws an error if size greater than 50', async () => {
      // Act
      const promise =  userService.findUsers({ page: 1, size: 51 });

      // Assert
      expect(promise).rejects.toThrow(new Error('Size should not be greater than 50.'));
    });
  });
});
