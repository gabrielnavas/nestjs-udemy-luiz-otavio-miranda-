export class AlreadyExistsPessoaWithException extends Error {
  constructor(attribute: string) {
    super(`Já existe uma pessoa com esse ${attribute}.`);
  }
}

export class PessoaNotFoundException extends Error {
  constructor(message: string = 'Pessoa não encontrada') {
    super(message);
  }
}
