import { Injectable } from '@nestjs/common';
import { RecadoDto } from './dtos';
import { RecadoNotFoundException } from './exceptions';
import { randomUUID } from 'crypto';

@Injectable()
export class RecadosService {
  private readonly recados: RecadoDto[] = new Array(50).fill('').map((_, index) =>
    ({ id: randomUUID(), message: `Ola mundo ${index + 1}!!` })
  );

  createOne(dto: RecadoDto) {
    this.recados.push({ id: randomUUID(), message: dto.message })
  }

  deleteOne(id: string) {
    const index = this.recados.findIndex(recado => recado.id === id)
    if (index === -1) {
      throw new RecadoNotFoundException('Recado não encontrado.')
    }
    this.recados.splice(index, 1)
  }

  findOne(id: string) {
    const recado = this.recados.find(recado => recado.id === id)
    if (!recado) {
      throw new RecadoNotFoundException('Recado não encontrado.')
    }
    return recado;
  }

  findAll(page: number, size: number) {
    const start = (page - 1) * size
    const end = start + size
    const recados = this.recados.slice(start, end);
    return {
      recados,
      totaItems: this.recados.length,
      totalPages: Math.ceil(this.recados.length/size)
    }
  }

  updateOne(id: string, dto: RecadoDto) {
    const index = this.recados.findIndex(recado => recado.id === id)
    if (index === -1) {
      throw new RecadoNotFoundException('Recado não encontrado.')
    }
    this.recados[index].message = dto.message
  }
}
