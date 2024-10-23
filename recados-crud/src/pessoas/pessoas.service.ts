import { Injectable } from '@nestjs/common';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { Repository } from 'typeorm';
import { PessoaDto } from './dto/pessoa.dto';
import {
  AlreadyExistsPessoaWithException,
  PessoaNotFoundException,
} from './exceptions';
import { PessoaWrapper } from './pessoa.wrapper';

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
      throw new AlreadyExistsPessoaWithException('E-mail');
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
      throw new PessoaNotFoundException();
    }
    return this.pessoaWrapper.mapEntityToDto(pessoa);
  }

  async update(id: number, dto: UpdatePessoaDto): Promise<void> {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (pessoa === null) {
      throw new PessoaNotFoundException();
    }
    if (dto.email) {
      const userByEmail = await this.pessoaRepository
        .createQueryBuilder()
        .where('LOWER(user) = LOWER(:email)', { email: dto.email })
        .getOne();
      if (userByEmail !== null) {
        throw new AlreadyExistsPessoaWithException('E-mail');
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
      throw new PessoaNotFoundException();
    }
    this.pessoaRepository.remove(pessoa);
  }
}
