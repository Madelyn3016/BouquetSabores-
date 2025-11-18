import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { DetailOrdersService } from './detail-orders.service';
import { CreateDetailOrderDto } from './dto/createDetail-order.dto';
import { UpdateDetailOrderDto } from './dto/updateDetail-order.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';

@Controller('detail-orders')
export class DetailOrdersController {
	constructor(private readonly detailService: DetailOrdersService) {}

	@UseGuards(AuthGuard)
	@Post()
	create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateDetailOrderDto) {
		return this.detailService.create(dto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Get()
	findAll() {
		return this.detailService.findAll();
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.detailService.findOne(id);
	}

	@UseGuards(AuthGuard)
	@Put(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateDetailOrderDto,
	) {
		return this.detailService.update(id, dto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.detailService.remove(id);
	}
}
