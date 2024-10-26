import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaDto } from './dto/pessoa.dto';
import { PessoaWrapper } from './pessoa.wrapper';

// Atenção
// em produção deve-se usar transações
// adicione se for o caso

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,

    private readonly pessoaWrapper: PessoaWrapper,
  ) {}
  async create(dto: CreatePessoaDto): Promise<PessoaDto> {
    const userByEmail = await this.pessoaRepository.findOneBy({
      email: dto.email,
    });
    if (userByEmail !== null) {
      throw new ConflictException('Já existe uma pessoa com esse e-mail.');
    }

    const person = this.pessoaRepository.create({
      name: dto.name,
      email: dto.email.toLocaleLowerCase(),
      passwordHash: dto.password,
    });
    const pessoaCreated = await this.pessoaRepository.save(person);
    return this.pessoaWrapper.mapEntityToDto(pessoaCreated);
  }

  async findOne(id: number): Promise<PessoaDto> {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (pessoa === null) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return this.pessoaWrapper.mapEntityToDto(pessoa);
  }

  async update(id: number, dto: UpdatePessoaDto): Promise<void> {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (pessoa === null) {
      throw new NotFoundException();
    }
    if (dto.email) {
      const userByEmail = await this.pessoaRepository
        .createQueryBuilder()
        .where('LOWER(user) = LOWER(:email)', { email: dto.email })
        .getOne();
      if (userByEmail !== null) {
        throw new ConflictException('Já existe uma pessoa com esse e-mail.');
      } else {
        pessoa.email = dto.email.toLocaleLowerCase();
      }
    }
    if (dto.name) {
      pessoa.name = dto.name;
    }
    if (dto.password) {
      pessoa.passwordHash = dto.password;
    }
    this.pessoaRepository.save(pessoa);
  }

  async remove(id: number): Promise<void> {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (pessoa === null) {
      throw new NotFoundException();
    }
    this.pessoaRepository.remove(pessoa);
  }
}
