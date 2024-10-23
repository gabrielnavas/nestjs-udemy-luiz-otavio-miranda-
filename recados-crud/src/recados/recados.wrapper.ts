import { Injectable } from '@nestjs/common';
import { RecadoDto } from './dto/recado.dto';
import { Recado } from './entities/recado.entity';
import { PessoaWrapper } from 'src/pessoas/pessoa.wrapper';

@Injectable()
export class RecadosWrapper {
  constructor(private readonly pessoaWrapper: PessoaWrapper) {}

  mapEntityToDto = (recado: Recado): RecadoDto => {
    return {
      id: recado.id,
      to: this.pessoaWrapper.mapEntityToDto(recado.to),
      from: this.pessoaWrapper.mapEntityToDto(recado.from),
      createdAt: recado.createdAt,
      updatedAt: recado.updatedAt,
      text: recado.text,
      read: recado.read,
    };
  };
}
