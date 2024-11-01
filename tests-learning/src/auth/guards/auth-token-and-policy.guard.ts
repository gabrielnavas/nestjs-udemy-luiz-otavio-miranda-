import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { Policy } from '../enums/route-policies.enum';

@Injectable()
export class AuthTokenAndPolicyGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,

    private readonly userService: UsersService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
      });
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;

      const user = await this.userService.findUserById(payload.sub);
      if (!user || !user.active) {
        throw new ForbiddenException('Sua conta está desativada.');
      }

      return this.hasAnyPolicy(user.policies, context);
    } catch (err) {
      if (
        err instanceof UnauthorizedException ||
        ForbiddenException ||
        NotFoundException
      ) {
        throw err;
      }
      throw new InternalServerErrorException(
        'Ocorreu um problema. Tente novamente mais tarde.',
      );
    }
  }

  hasAnyPolicy(userPolicies: string[], context: ExecutionContext): boolean {
    const routePolicyRequired = this.reflector.get<Policy | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );

    // a rota não tem nenhum metadado de policy definida
    if (!routePolicyRequired) {
      return true;
    }

    if (userPolicies.some((policy) => policy === routePolicyRequired)) {
      return true;
    }
    return false;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') {
      return;
    }

    return authorization.split(' ')[1];
  }
}
