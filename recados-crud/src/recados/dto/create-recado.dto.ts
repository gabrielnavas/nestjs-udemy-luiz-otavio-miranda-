import {
  IsNotEmpty,
  isString,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  text: Readonly<string>;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  from: Readonly<string>;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  to: Readonly<string>;
}
