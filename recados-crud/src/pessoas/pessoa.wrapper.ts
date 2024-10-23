import { Injectable } from "@nestjs/common";
import { PessoaDto } from "./dto/pessoa.dto";
import { Pessoa } from "./entities/pessoa.entity";

@Injectable()
export class PessoaWrapper {
  mapEntityToDto = (pessoa: Pessoa): PessoaDto => {
    return {
      id: pessoa.id,
      name: pessoa.name,
      email: pessoa.email,
      createdAt: pessoa.createdAt,
      updatedAt: pessoa.updatedAt,
    }
  }
}