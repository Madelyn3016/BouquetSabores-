import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Crear usuario', description: 'Requiere autenticación. Crea un usuario nuevo' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente (sin password en respuesta)' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o email duplicado' })
    @ApiBody({ type: CreateUserDto })
    create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Listar todos los usuarios', description: 'Solo admin. Retorna lista sin passwords' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios' })
    @ApiResponse({ status: 403, description: 'Acceso denegado (requiere rol admin)' })
    async findAll() {
        const users = await this.userService.findAll();
        return users.map(({ password, ...safe }) => safe);
    }

    @Get('by-email/:email')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Buscar usuario por email', description: 'Solo admin' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado (sin password)' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiParam({ name: 'email', example: 'usuario@example.com' })
    async findByEmail(@Param('email') email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return { message: 'Usuario no encontrado' };
        }
        const { password, ...safe } = user;
        return safe;
    }

    @Get(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Solo admin' })
    @ApiResponse({ status: 200, description: 'Usuario encontrado (sin password)' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiParam({ name: 'id', example: 1 })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const { password, ...safe } = await this.userService.findOne(id);
        return safe;
    }

    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Actualizar usuario', description: 'Actualiza datos del usuario (retorna sin password)' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiParam({ name: 'id', example: 1 })
    @ApiBody({ type: UpdateUserDto })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateUserDto
    ) {
        const updated = await this.userService.update(id, dto);
        const { password, ...safe } = updated;
        return safe;
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Eliminar usuario', description: 'Elimina un usuario por ID' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    @ApiParam({ name: 'id', example: 1 })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}
