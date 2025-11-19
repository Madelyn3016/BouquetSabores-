import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	@UseGuards(AuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Crear orden', description: 'Requiere autenticación. Crea una orden nueva' })
	@ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
	@ApiResponse({ status: 400, description: 'Datos inválidos' })
	@ApiBody({ type: CreateOrderDto })
	create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateOrderDto) {
		return this.ordersService.create(dto);
	}

	@Get()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Listar todas las órdenes', description: 'Solo admin. Retorna todas las órdenes con detalles' })
	@ApiResponse({ status: 200, description: 'Lista de órdenes' })
	@ApiResponse({ status: 403, description: 'Acceso denegado (requiere rol admin)' })
	findAll() {
		return this.ordersService.findAll();
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Obtener orden por ID', description: 'Requiere autenticación' })
	@ApiResponse({ status: 200, description: 'Orden encontrada' })
	@ApiResponse({ status: 404, description: 'Orden no encontrada' })
	@ApiParam({ name: 'id', example: 1 })
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.ordersService.findOne(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Actualizar orden', description: 'Solo admin. Actualiza datos de la orden (ej: estado)' })
	@ApiResponse({ status: 200, description: 'Orden actualizada' })
	@ApiResponse({ status: 404, description: 'Orden no encontrada' })
	@ApiParam({ name: 'id', example: 1 })
	@ApiBody({ type: UpdateOrderDto })
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateOrderDto,
	) {
		return this.ordersService.update(id, dto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Eliminar orden', description: 'Solo admin. Elimina una orden por ID' })
	@ApiResponse({ status: 200, description: 'Orden eliminada exitosamente' })
	@ApiResponse({ status: 404, description: 'Orden no encontrada' })
	@ApiParam({ name: 'id', example: 1 })
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.ordersService.remove(id);
	}
}
