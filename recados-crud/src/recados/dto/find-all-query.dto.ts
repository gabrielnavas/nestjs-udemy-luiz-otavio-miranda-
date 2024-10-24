import { PartialType } from '@nestjs/mapped-types';

import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationDto } from 'src/app/common/dto/pagination.dto';

export class FindAllQueryDto extends PartialType(PaginationDto) {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly q: string;
}
