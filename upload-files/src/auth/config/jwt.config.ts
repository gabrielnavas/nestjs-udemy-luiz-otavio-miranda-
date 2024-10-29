import { registerAs } from '@nestjs/config';

type JwtConfig = {
  secret: string;
  audience: string;
  issuer: string;
  jwtTtl: number;
};

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE,
    issuer: process.env.JWT_TOKEN_ISSUER,
    jwtTtl: Number(process.env.JWT_TOKEN_TTL),
  } as JwtConfig;
});
