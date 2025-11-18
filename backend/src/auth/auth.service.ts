import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../users/dto/loginUser.dto';
import { CreateUserDto } from '../users/dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async signInService(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
        const { email, password } = loginUserDto;
        const validatedUser = await this.validateUser(email, password);
        if (!validatedUser) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        const payload = { sub: validatedUser.id, email: validatedUser.email, rol: validatedUser.rol };
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async register(dto: CreateUserDto): Promise<{ access_token: string }> {
        const user = await this.userService.create(dto);
        const payload = { sub: user.id, email: user.email, rol: user.rol };
        return { access_token: this.jwtService.sign(payload) };
    }

    private async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        const { password: _pwd, ...safeUser } = user;
        return safeUser;
    }
}