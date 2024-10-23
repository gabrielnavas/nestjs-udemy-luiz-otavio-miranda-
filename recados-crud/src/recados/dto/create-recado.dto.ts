import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  readonly text: string;

  @IsNumber()
  @IsNotEmpty()
  readonly fromPessoaId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly toPessoaId: number;
}
