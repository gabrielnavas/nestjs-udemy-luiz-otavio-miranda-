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
import { ProtocolRegEx } from 'src/common/regex/protocol.regex';
import { RemoveSpacesRegex } from 'src/common/regex/remove-spaces.regex';
import { OnlyLowercaseLetterRegex } from 'src/common/regex/only-lowercase-letter.regex';

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
    }, {
      provide: ProtocolRegEx,
      useClass: 1 === 1 ? RemoveSpacesRegex : OnlyLowercaseLetterRegex
    }
  ],
  exports: [SERVER_NAME]
})
export class RecadosModule {}
