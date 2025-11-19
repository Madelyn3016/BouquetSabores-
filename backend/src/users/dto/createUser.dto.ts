import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '3001234567', description: 'Teléfono de contacto' })
    @IsNotEmpty()
    @IsString()
    telephone: string;

    @ApiProperty({ example: 'usuario@example.com', description: 'Email único del usuario' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Password123!', description: 'Contraseña (mínimo 6 caracteres)' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Password123!', description: 'Confirmación de contraseña' })
    @Validate(MatchPassword, ['password'],)
    confirmPassword: string;

    @ApiProperty({ example: 'user', description: 'Rol del usuario (user o admin)', enum: ['user', 'admin'] })
    @IsNotEmpty()
    @IsString()
    rol: string;
}
