import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class FindAllQuery {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  @Type(() => Number)
  readonly size: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly page: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly q: string;
}
