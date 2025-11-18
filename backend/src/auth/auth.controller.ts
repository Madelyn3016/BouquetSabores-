import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/loginUser.dto';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    signIn(
        @Body(new ValidationPipe({ whitelist: true, transform: true }))
        loginUserDto: LoginUserDto,
    ) {
        return this.authService.signInService(loginUserDto);
    }

    @Post('register')
    register(
        @Body(new ValidationPipe({ whitelist: true, transform: true }))
        dto: CreateUserDto,
    ) {
        return this.authService.register(dto);
    }
}

