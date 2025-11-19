import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { DetailOrdersService } from './detail-orders.service';
import { CreateDetailOrderDto } from './dto/createDetail-order.dto';
import { UpdateDetailOrderDto } from './dto/updateDetail-order.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('detail-orders')
@Controller('detail-orders')
export class DetailOrdersController {
	constructor(private readonly detailService: DetailOrdersService) {}

	@Post()
	@UseGuards(AuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Crear detalle de orden', description: 'Requiere autenticación. Crea un detalle de orden nuevo' })
	@ApiResponse({ status: 201, description: 'Detalle creado exitosamente' })
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	@ApiBody({ type: CreateDetailOrderDto })
	create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateDetailOrderDto) {
		return this.detailService.create(dto);
	}

	@Get()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Listar detalles de órdenes', description: 'Solo admin. Retorna todos los detalles' })
	@ApiResponse({ status: 200, description: 'Lista de detalles de órdenes' })
	@ApiResponse({ status: 403, description: 'Acceso denegado (requiere rol admin)' })
	findAll() {
		return this.detailService.findAll();
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Obtener detalle por ID', description: 'Requiere autenticación' })
	@ApiResponse({ status: 200, description: 'Detalle encontrado' })
	@ApiResponse({ status: 404, description: 'Detalle no encontrado' })
	@ApiParam({ name: 'id', example: 1 })
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.detailService.findOne(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Actualizar detalle de orden', description: 'Requiere autenticación. Actualiza datos del detalle' })
	@ApiResponse({ status: 200, description: 'Detalle actualizado' })
	@ApiResponse({ status: 404, description: 'Detalle no encontrado' })
	@ApiParam({ name: 'id', example: 1 })
	@ApiBody({ type: UpdateDetailOrderDto })
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateDetailOrderDto,
	) {
		return this.detailService.update(id, dto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Eliminar detalle de orden', description: 'Solo admin. Elimina un detalle por ID' })
	@ApiResponse({ status: 200, description: 'Detalle eliminado exitosamente' })
	@ApiResponse({ status: 404, description: 'Detalle no encontrado' })
	@ApiParam({ name: 'id', example: 1 })
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.detailService.remove(id);
	}
}
