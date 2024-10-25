import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // pega o token
    // verifica a role dele
    // pode ou não verificar a vericidade do usuário no banco de dados
    //  se ele for admin, ele pode acessar a rota
    const canAccessRoute = true;
    console.log('Sou um ADMIN!');
    return canAccessRoute;
  }
}
