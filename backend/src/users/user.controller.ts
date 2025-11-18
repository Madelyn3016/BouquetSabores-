import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesEnum } from 'src/enum/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard)
    @Post()
    create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    @Get()
    async findAll() {
        const users = await this.userService.findAll();
        return users.map(({ password, ...safe }) => safe);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    @Get('by-email/:email')
    async findByEmail(@Param('email') email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            return { message: 'Usuario no encontrado' };
        }
        const { password, ...safe } = user;
        return safe;
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesEnum.ADMIN)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const { password, ...safe } = await this.userService.findOne(id);
        return safe;
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateUserDto
    ) {
        const updated = await this.userService.update(id, dto);
        const { password, ...safe } = updated;
        return safe;
    }

    
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id);
    }
}
