import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty({ message: 'El email del usuario es obligatorio'})
    @IsEmail({}, { message: 'El email debe tener un formato válido' })
    email: string;
}
