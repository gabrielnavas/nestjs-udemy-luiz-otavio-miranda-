import { Injectable } from '@nestjs/common';
import { RecadoNotFoundException } from './exceptions';
import { Recado } from './entities/recado.entity';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { RecadoDto } from './dto/recado.dto';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { Brackets, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecadoDtoPaginate } from './dto/recado-paginate.dto';
import { RecadosWrapper } from './recados.wrapper';
import { PessoaNotFoundException } from 'src/pessoas/exceptions';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';

// Atenção
// em produção deve-se usar transações
// adicione se for o caso

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,

    private readonly recadosWrapper: RecadosWrapper,
  ) {}

  async createOne(dto: CreateRecadoDto): Promise<RecadoDto> {
    const toPessoa = await this.pessoaRepository.findOneBy({
      id: dto.toPessoaId,
    });
    if (toPessoa === null) {
      throw new PessoaNotFoundException('Pessoa de destino não encontrada');
    }
    const fromPessoa = await this.pessoaRepository.findOneBy({
      id: dto.fromPessoaId,
    });
    if (fromPessoa === null) {
      throw new PessoaNotFoundException('Pessoa de origem não encontrada');
    }

    const recado = await this.recadoRepository.create({
      to: toPessoa,
      from: fromPessoa,
      createdAt: new Date(),
      read: false,
      text: dto.text,
    });
    await this.recadoRepository.save(recado);
    return this.recadosWrapper.mapEntityToDto(recado);
  }

  async deleteOne(id: number): Promise<void> {
    const recado = await this.recadoRepository.findOneBy({ id });
    if (!recado) {
      throw new RecadoNotFoundException('Recado não encontrado.');
    }
    await this.recadoRepository.delete(id);
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: { id },
      relations: ['to', 'from'],
      select: {
        to: {
          id: true,
          name: true,
          createdAt: true,
          email: true,
          updatedAt: true,
        },
        from: {
          id: true,
          name: true,
          createdAt: true,
          email: true,
          updatedAt: true,
        },
      },
    });
    if (!recado) {
      throw new RecadoNotFoundException('Recado não encontrado.');
    }
    return recado;
  }

  async findAll(
    page: number,
    size: number,
    q: string,
  ): Promise<RecadoDtoPaginate> {
    const recados = await this.recadoRepository.find({
      take: size,
      skip: (page - 1) * size,
      relations: ['to', 'from'],
      order: {
        createdAt: 'DESC',
      },
      select: {
        to: {
          id: true,
          name: true,
          createdAt: true,
          email: true,
          updatedAt: true,
        },
        from: {
          id: true,
          name: true,
          createdAt: true,
          email: true,
          updatedAt: true,
        },
      },
    });

    const totalItems = await this.recadoRepository.count();

    return {
      recados: recados.map(this.recadosWrapper.mapEntityToDto),
      totalItems,
      totalPages: Math.ceil(totalItems / size),
    };
  }

  async updateOne(id: number, dto: UpdateRecadoDto): Promise<void> {
    const recado = await this.recadoRepository.findOneBy({ id });
    if (!recado) {
      throw new RecadoNotFoundException('Recado não encontrado.');
    }

    if (dto.toPessoaId) {
      const toPessoa = await this.pessoaRepository.findOneBy({
        id: dto.toPessoaId,
      });
      if (toPessoa === null) {
        throw new PessoaNotFoundException('Pessoa de destino não encontrada');
      } else {
        recado.to = toPessoa;
      }
    }
    if (dto.fromPessoaId) {
      const fromPessoa = await this.pessoaRepository.findOneBy({
        id: dto.fromPessoaId,
      });
      if (fromPessoa === null) {
        throw new PessoaNotFoundException('Pessoa de origem não encontrada');
      } else {
        recado.from = fromPessoa;
      }
    }
    if (dto.text) {
      recado.text = dto.text;
    }
    if (dto.read) {
      recado.read = dto.read;
    }
    await this.recadoRepository.save(recado);
  }
}
