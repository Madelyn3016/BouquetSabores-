import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@UseGuards(AuthGuard)
	@Post()
	create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateOrderDto) {
		return this.ordersService.create(dto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Get()
	findAll() {
		return this.ordersService.findAll();
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.ordersService.findOne(id);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Put(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateOrderDto,
	) {
		return this.ordersService.update(id, dto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.ordersService.remove(id);
	}
}
