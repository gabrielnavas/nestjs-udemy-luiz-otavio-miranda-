import { Injectable } from '@nestjs/common';

@Injectable()
export class ConceitosAutomaticoService {
  getConceitosAutomatico(): string {
    return 'conceito automatico do service'
  }
}
