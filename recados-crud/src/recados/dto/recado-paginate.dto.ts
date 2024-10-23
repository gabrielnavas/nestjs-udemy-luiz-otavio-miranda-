import { Recado } from '../entities/recado.entity';
import { RecadoDto } from './recado.dto';

export class RecadoDtoPaginate {
  recados: RecadoDto[];
  totaItems: number;
  totalPages: number;
}
