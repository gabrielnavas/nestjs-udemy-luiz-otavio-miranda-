import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  exemplo() {
    return 'pega o exemplo'
  }
}
