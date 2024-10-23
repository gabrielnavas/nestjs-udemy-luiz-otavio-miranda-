import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

import {
  AlreadyExistsPessoaWithException,
  PessoaNotFoundException,
} from './exceptions';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPessoaDto: CreatePessoaDto) {
    try {
      return await this.pessoasService.create(createPessoaDto);
    } catch (err) {
      if (
        err instanceof
        (AlreadyExistsPessoaWithException || PessoaNotFoundException)
      ) {
        throw new BadRequestException(err.message);
      }
      console.log(err);
      throw new InternalServerErrorException(
        'Algo acontenceu. Tente novamente mais tarde.',
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.pessoasService.findOne(id);
    } catch (err) {
      if (err instanceof PessoaNotFoundException) {
        throw new BadRequestException(err.message);
      }
      console.log(err);
      throw new InternalServerErrorException(
        'Algo acontenceu. Tente novamente mais tarde.',
      );
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
  ) {
    try {
      await this.pessoasService.update(id, updatePessoaDto);
    } catch (err) {
      if (err instanceof AlreadyExistsPessoaWithException) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof PessoaNotFoundException) {
        throw new BadRequestException(err.message);
      }
      console.log(err);
      throw new InternalServerErrorException(
        'Algo acontenceu. Tente novamente mais tarde.',
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.pessoasService.remove(id);
    } catch (err) {
      if (err instanceof PessoaNotFoundException) {
        throw new BadRequestException(err.message);
      }
      console.log(err);
      throw new InternalServerErrorException(
        'Algo acontenceu. Tente novamente mais tarde.',
      );
    }
  }
}
