import { HashingService } from 'src/auth/hashing/hashing.service';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dtos/create-user.dto';
import { Policy } from 'src/auth/enums/route-policies.enum';

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

  describe('createUser success', () => {
    it('should create a new user', async () => {
      //  Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: '12345678',
      };
      jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_PASSWORD')

      //  Act
      const result = await userService.createUser({
        email: 'test@example.com',
        password: '12345678',
      });

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
  });
});
