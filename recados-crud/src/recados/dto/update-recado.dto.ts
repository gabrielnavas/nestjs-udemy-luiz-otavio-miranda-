import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  text?: Readonly<string>;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  from?: Readonly<string>;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @IsOptional()
  to?: Readonly<string>;
}
