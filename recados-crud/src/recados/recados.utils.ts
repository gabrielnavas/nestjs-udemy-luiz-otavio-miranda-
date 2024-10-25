import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosUtils {
  inverteString(str: string): string {
    // Gab -> baG
    return str.split('').reverse().join('');
  }
}
