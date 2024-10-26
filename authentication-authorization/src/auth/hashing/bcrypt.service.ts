import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService extends HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  async compare(password: string, passwordHash: string): Promise<boolean> {
    const equals = await bcrypt.compare(password, passwordHash);
    return equals;
  }
}
