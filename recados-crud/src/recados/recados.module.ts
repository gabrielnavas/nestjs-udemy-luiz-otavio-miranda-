import { Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { RecadosWrapper } from './recados.wrapper';
import { PessoaWrapper } from 'src/pessoas/pessoa.wrapper';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { RecadosUtils } from './recados.utils';

@Module({
  imports: [TypeOrmModule.forFeature([Recado, Pessoa])],
  controllers: [RecadosController],
  providers: [RecadosService, RecadosWrapper, PessoaWrapper, RecadosUtils],
})
export class RecadosModule {}
