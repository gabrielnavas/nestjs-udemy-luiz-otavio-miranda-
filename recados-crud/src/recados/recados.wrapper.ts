import { Injectable } from '@nestjs/common';
import { RecadoDto } from './dto/recado.dto';
import { Recado } from './entities/recado.entity';

@Injectable()
export class RecadosWrapper {
  mapEntityToDto = (recado: Recado): RecadoDto => {
    return {
      id: recado.id,
      to: recado.to,
      from: recado.from,
      createdAt: recado.createdAt,
      updatedAt: recado.updatedAt,
      text: recado.text,
      read: recado.read,
    };
  };
}
