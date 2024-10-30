import { HashingService } from 'src/auth/hashing/hashing.service';
import { UsersService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('UsersService', () => {
  let userService: UsersService;
  let hashingService: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: HashingService,
          useValue: {},
        },
      ],
    }).compile();
    userService = module.get(UsersService);
    hashingService = module.get(HashingService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined()
    expect(hashingService).toBeDefined()
  });
});
