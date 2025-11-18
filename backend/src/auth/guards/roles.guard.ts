import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable} from 'rxjs';
import { Reflector} from '@nestjs/core';
import { RolesEnum } from 'src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('Roles requeridos:', requiredRoles);
        const request = context.switchToHttp().getRequest();
        const payload = request.user;
        console.log('Payload del usuario:', payload);

        const hasRole = () => requiredRoles.some((role) => payload.rol?.includes(role));

        const validate = payload && payload.rol && hasRole();
        if (!validate) {
            throw new ForbiddenException('No tienes permisos para acceder a este recurso');
        }
        return validate;
    }
}