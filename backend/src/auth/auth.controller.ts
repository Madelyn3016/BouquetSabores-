import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/loginUser.dto';
import { CreateUserDto } from '../users/dto/createUser.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Iniciar sesión', description: 'Autenticar usuario y obtener token JWT' })
    @ApiResponse({ status: 200, description: 'Login exitoso, retorna access_token' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    @ApiBody({ type: LoginUserDto })
    signIn(
        @Body(new ValidationPipe({ whitelist: true, transform: true }))
        loginUserDto: LoginUserDto,
    ) {
        return this.authService.signInService(loginUserDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Registrar nuevo usuario', description: 'Crear una cuenta de usuario nueva' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente, retorna access_token' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o email ya existe' })
    @ApiBody({ type: CreateUserDto })
    register(
        @Body(new ValidationPipe({ whitelist: true, transform: true }))
        dto: CreateUserDto,
    ) {
        return this.authService.register(dto);
    }
}

