import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';

export class LoginUserDto extends PickType(CreateUserDto, ['email', 'password'] as const) {}