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
    const recado = await this.recadoRepository.findOneBy({ id });
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
    const query = this.recadoRepository
      .createQueryBuilder('recado')
      .leftJoinAndSelect('recado.from', 'p_from') 
      .leftJoinAndSelect('recado.to', 'p_to')
      .skip((page - 1) * size)
      .take(size);

    if (q) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('recado.text ILIKE :q', { q: `%${q}%` })
        }),
      );
    }

    const [recados, totaItems] = await query.getManyAndCount();

    return {
      recados: recados.map(this.recadosWrapper.mapEntityToDto),
      totaItems,
      totalPages: Math.ceil(totaItems / size),
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
