import { PessoaDto } from "src/pessoas/dto/pessoa.dto";

export type RecadoDto = {
  id: Readonly<number>;
  text: Readonly<string>;
  from: Readonly<PessoaDto>;
  to: Readonly<PessoaDto>;
  read: Readonly<boolean>;
  createdAt: Readonly<Date>;
  updatedAt: Readonly<Date>;
};
