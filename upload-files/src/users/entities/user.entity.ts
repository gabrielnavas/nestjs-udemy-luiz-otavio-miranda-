import { Policy } from 'src/auth/enums/route-policies.enum';

export class User {
  id: string;
  email: string;
  passwordHash: string;
  active: boolean;
  policies: Policy[];
  picture?: string;
}
