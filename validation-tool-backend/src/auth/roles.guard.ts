import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // try to get @Roles from invoked Controller method
      context.getClass()    // fallback: get @Roles from Controller class
    ]);
    //console.log(`Required Roles = ${requiredRoles}`);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userRoles = [];
    user.privileges.forEach(p => {
      userRoles.push(...p.roles);
    });
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
