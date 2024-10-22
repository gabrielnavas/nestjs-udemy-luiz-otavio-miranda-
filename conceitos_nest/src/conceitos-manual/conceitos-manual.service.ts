import { Injectable } from "@nestjs/common";

@Injectable()
export class ConceitosManualService{
  manual() {
    return "exemplo manual do service"
  }
}