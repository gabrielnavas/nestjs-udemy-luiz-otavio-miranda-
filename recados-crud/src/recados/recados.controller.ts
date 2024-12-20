import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/update-recado.dto';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { TimingConnectionInterceptior } from 'src/common/interceptors/timing-connection.interceptor';
import { ErrorHandlingInterceptor } from 'src/common/interceptors/error-handling.interceptor';
import { SimpleCacheInterceptor } from 'src/common/interceptors/simple-cache.interceptor';
import { ChangeDataInterceptor } from 'src/common/interceptors/change-data.interceptor';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';
import { Request, request } from 'express';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { UrlParam } from 'src/common/params/url-params.decorator';
import { ReqDataParam } from 'src/common/params/req-data-params.decorator';

@Controller('recados')
@UseGuards(IsAdminGuard)
@UseInterceptors(SimpleCacheInterceptor, ChangeDataInterceptor)
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthTokenInterceptor, TimingConnectionInterceptior)
  findAll(@Query() dto: FindAllQueryDto, @UrlParam() url: string) {
    console.log(url);
    return this.recadosService.findAll(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ErrorHandlingInterceptor)
  async findOne(@Param('id', ParseIntIdPipe) id: number, @Req() req: Request) {
    console.log(req['user']);
    return await this.recadosService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(AddHeaderInterceptor)
  createOne(@Body() dto: CreateRecadoDto, @ReqDataParam('method') method: string) {
    console.log(method);
    return this.recadosService.createOne(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecadoDto,
  ) {
    return this.recadosService.updateOne(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ParseIntPipe)
  async deleteOne(@Param('id') id: number) {
    await this.recadosService.deleteOne(id);
  }
}
