import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    telephone: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @Validate(MatchPassword, ['password'],)
    confirmPassword: string;

    @IsNotEmpty()
    @IsString()
    rol: string;
}
