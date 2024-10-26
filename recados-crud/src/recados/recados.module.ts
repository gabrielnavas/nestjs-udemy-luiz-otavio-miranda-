import { forwardRef, Module } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recado } from './entities/recado.entity';
import { RecadosWrapper } from './recados.wrapper';
import { PessoaWrapper } from 'src/pessoas/pessoa.wrapper';
import { Pessoa } from 'src/pessoas/entities/pessoa.entity';
import { RecadosUtils } from './recados.utils';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { SERVER_NAME } from 'src/common/constants/server-name.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recado, Pessoa]),
    forwardRef(() => PessoasModule),
  ],
  controllers: [RecadosController],
  providers: [
    RecadosService,
    RecadosWrapper,
    PessoaWrapper,
    RecadosUtils,
    {
      provide: SERVER_NAME,
      useValue: 'My Name Is Gab API NEST JS',
    },
  ],
})
export class RecadosModule {}
