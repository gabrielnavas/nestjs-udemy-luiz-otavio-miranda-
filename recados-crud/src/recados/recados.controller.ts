import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { RecadosService } from './recados.service';
import { RecadoNotFoundException } from './exceptions';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptior } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptior } from 'src/common/interceptors/error-handling.interceptor';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TimingConnectionInterceptior)
  findAll(@Query() dto: FindAllQueryDto) {
    return this.recadosService.findAll(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ErrorHandlingInterceptior)
  async findOne(@Param('id', ParseIntIdPipe) id: number) {
    console.log(id, typeof id);
    throw new Error('aaaaaa')

    try {
      return await this.recadosService.findOne(id);
    } catch (err) {
      if (err instanceof RecadoNotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException(
        'Ocorreu um problema. Tente novamente mais tarde',
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(AddHeaderInterceptor)
  createOne(@Body() dto: CreateRecadoDto) {
    return this.recadosService.createOne(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecadoDto,
  ) {
    try {
      return this.recadosService.updateOne(id, dto);
    } catch (err) {
      if (err instanceof RecadoNotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException(
        'Ocorreu um problema. Tente novamente mais tarde',
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseIntPipe)
  async deleteOne(@Param('id') id: number) {
    try {
      await this.recadosService.deleteOne(id);
    } catch (err) {
      if (err instanceof RecadoNotFoundException) {
        throw new NotFoundException(err.message);
      }
      throw new InternalServerErrorException(
        'Ocorreu um problema. Tente novamente mais tarde',
      );
    }
  }
}
