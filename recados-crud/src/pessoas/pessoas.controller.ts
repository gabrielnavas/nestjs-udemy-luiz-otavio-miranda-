import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';

import { PessoasService } from './pessoas.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { SimpleCacheInterceptor } from 'src/common/interceptors/simple-cache.interceptor';

@Controller('pessoas')
@UseInterceptors(SimpleCacheInterceptor)
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPessoaDto: CreatePessoaDto) {
    return await this.pessoasService.create(createPessoaDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.pessoasService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
  ) {
    await this.pessoasService.update(id, updatePessoaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.pessoasService.remove(id);
  }
}
