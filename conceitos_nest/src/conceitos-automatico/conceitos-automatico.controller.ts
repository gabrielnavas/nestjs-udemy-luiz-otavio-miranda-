import { Controller, Get } from '@nestjs/common';

@Controller('conceitos-automatico')
export class ConceitosAutomaticoController {

  @Get()
  getConceitosAutomatico(): string {
    return 'conceito automatico'
  }
}
