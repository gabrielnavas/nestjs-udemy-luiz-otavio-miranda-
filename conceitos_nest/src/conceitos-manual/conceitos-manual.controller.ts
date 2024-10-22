import { Controller, Get } from "@nestjs/common";

@Controller('conceitos-manual')
export class ConceitosManualController {
  @Get()
  conceitoManual(): string {
    return 'conceito manual'
  }
}