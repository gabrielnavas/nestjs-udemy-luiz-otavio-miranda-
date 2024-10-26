import { forwardRef, Module } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { PessoasController } from './pessoas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { PessoaWrapper } from './pessoa.wrapper';
import { RecadosModule } from 'src/recados/recados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pessoa]),
    forwardRef(() => RecadosModule),
  ],
  controllers: [PessoasController],
  providers: [PessoasService, PessoaWrapper],
  exports: [PessoasService], // para ser usado em outros modulos
})
export class PessoasModule {}
