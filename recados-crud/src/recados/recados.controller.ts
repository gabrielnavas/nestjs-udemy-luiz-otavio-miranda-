import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { RecadoDto } from './dtos';
import { randomUUID } from 'crypto';

@Controller('recados')
export class RecadosController {

  private readonly recados: RecadoDto[] = []

  @Get()
  findAll() {
    return this.recados;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const recado = this.recados.find(recado => recado.id === id)
    if (!recado) {
      throw new NotFoundException('Recado não encontrado.')
    }
    return recado;
  }

  @Post()
  createOne(@Body() dto: RecadoDto) {
    this.recados.push({ id: randomUUID(), message: dto.message })
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() dto: RecadoDto) {
    const index = this.recados.findIndex(recado => recado.id === id)
    if (index === -1) {
      throw new NotFoundException('Recado não encontrado.')
    }
    this.recados[index].message = dto.message
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    const index = this.recados.findIndex(recado => recado.id === id)
    if (index === -1) {
      throw new NotFoundException('Recado não encontrado.')
    }
    this.recados.splice(index, 1)
  }
}
