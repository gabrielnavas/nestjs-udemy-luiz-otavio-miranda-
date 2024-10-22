import { Module } from "@nestjs/common";
import { ConceitosManualController } from "./conceitos-manual.controller";
import { ConceitosManualService } from "./conceitos-manual.service";

@Module({
  providers: [ConceitosManualService],
  controllers: [ConceitosManualController]
})
export class ConceitoManualModule { }