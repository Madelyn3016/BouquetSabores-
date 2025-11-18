import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest<Request>();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token requerido');
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new BadRequestException('Configuracion incorrecta del servidor');

    }
    try {
        const payload = this.jwtService.verify(token, { secret});
        payload.exp = new Date(payload.exp * 1000);
        payload.iat = new Date(payload.iat * 1000);

        if (!payload.rol) {
            throw new UnauthorizedException('Token inválido: rol no encontrado');
        }

        (request as any).user = payload;
        return true;
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new UnauthorizedException('Token expirado');
        } else if (error instanceof JsonWebTokenError) {
            throw new UnauthorizedException('Token inválido');
        }
        throw new UnauthorizedException('Error de autenticacion');
    }
}
}
