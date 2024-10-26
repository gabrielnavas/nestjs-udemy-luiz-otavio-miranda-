import { ProtocolRegEx } from './protocol.regex';

export class RemoveSpacesRegex extends ProtocolRegEx {
  execute(str: string): string {
    return str.replace(/\s+/g, '');
  }
}