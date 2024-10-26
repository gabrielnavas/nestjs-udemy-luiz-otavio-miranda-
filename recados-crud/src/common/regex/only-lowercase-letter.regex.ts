import { ProtocolRegEx } from './protocol.regex';

export class OnlyLowercaseLetterRegex extends ProtocolRegEx {
  execute(str: string): string {
    return str.replace(/[^a-z]/, '');
  }
}