import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { error } from 'console';

describe('CreateUserDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new CreateUserDto();
    dto.email = 'any@email.com';
    dto.password = '12345678';
    const error = await validate(dto);
    expect(error.length).toBe(0);
  });

  it('should throw an error if email is invalid', async () => {
    const dto = new CreateUserDto();
    dto.email = 'any';
    dto.password = '12345678';
    const error = await validate(dto);
    expect(error.length).toBeGreaterThan(0);
    expect(error[0].property).toBe('email');
  });

  it('should throw an error if password is less than 8', async () => {
    const dto = new CreateUserDto();
    dto.email = 'any@email.com';
    dto.password = '1234567';
    const error = await validate(dto);
    expect(error.length).toBeGreaterThan(0);
    expect(error[0].property).toBe('password');
  });

  it('should throw an error if password is greater than 70', async () => {
    const dto = new CreateUserDto();
    dto.email = 'any@email.com';
    dto.password = new Array(71).fill('').map(() => '1').join('');
    const error = await validate(dto);
    expect(error.length).toBeGreaterThan(0);
    expect(error[0].property).toBe('password');
  });
});
