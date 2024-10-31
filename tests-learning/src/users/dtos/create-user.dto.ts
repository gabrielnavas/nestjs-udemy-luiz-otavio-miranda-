import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail está inválido.' })
  email: string;

  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(70, { message: 'A senha deve ter no máximo 70 caracteres.' })
  password: string;
}
