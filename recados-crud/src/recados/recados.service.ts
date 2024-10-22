import { Injectable } from '@nestjs/common';
import { RecadoDto } from './dtos';
import { RecadoNotFoundException } from './exceptions';
import { randomUUID } from 'crypto';

@Injectable()
export class RecadosService {
  private readonly recados: RecadoDto[] = []

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

  findAll() {
    return this.recados;
  }

  updateOne(id: string, dto: RecadoDto) {
    const index = this.recados.findIndex(recado => recado.id === id)
    if (index === -1) {
      throw new RecadoNotFoundException('Recado não encontrado.')
    }
    this.recados[index].message = dto.message
  }
}
