import { Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { RecadoDto } from './dtos';
import { randomUUID } from 'crypto';
import { RecadosService } from './recados.service';
import { RecadoNotFoundException } from './exceptions';

@Controller('recados')
export class RecadosController {

  constructor(private readonly recadosService: RecadosService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.recadosService.findAll()
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    try {
      return this.recadosService.findOne(id)
    } catch (err) {
      if (err instanceof RecadoNotFoundException) {
        throw new NotFoundException(err.message)
      }
      throw new InternalServerErrorException('Ocorreu um problema. Tente novamente mais tarde')
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOne(@Body() dto: RecadoDto) {
    return this.recadosService.createOne(dto)
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateOne(@Param('id') id: string, @Body() dto: RecadoDto) {
    try {
      return this.recadosService.updateOne(id, dto)
    } catch (err) {
      if (err instanceof RecadoNotFoundException) {
        throw new NotFoundException(err.message)
      }
      throw new InternalServerErrorException('Ocorreu um problema. Tente novamente mais tarde')
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOne(@Param('id') id: string) {
    try {
      return this.recadosService.deleteOne(id)
    } catch (err) {
      if (err instanceof RecadoNotFoundException) {
        throw new NotFoundException(err.message)
      }
      throw new InternalServerErrorException('Ocorreu um problema. Tente novamente mais tarde')
    }
  }
}
