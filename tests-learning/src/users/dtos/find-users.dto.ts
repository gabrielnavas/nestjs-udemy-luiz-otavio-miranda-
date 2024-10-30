import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class FindUsersDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  page: number = 1;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @Max(50)
  size: number = 10;
}
