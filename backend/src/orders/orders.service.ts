import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orders } from '../entities/orders.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrdersService {
	constructor(
		@InjectRepository(Orders)
		private readonly ordersRepo: Repository<Orders>,
	) {}

	create(dto: CreateOrderDto) {
		const entity = this.ordersRepo.create({
			date: new Date(dto.date),
			name_client: dto.name_client,
			telephone: dto.telephone,
			total: dto.total,
			state: dto.state,
			address: dto.address,
			method_pay: dto.method_pay,
		});
		return this.ordersRepo.save(entity);
	}

	findAll() {
		return this.ordersRepo.find({ relations: ['detailOrders'] });
	}

	async findOne(id: number) {
		const order = await this.ordersRepo.findOne({ where: { id }, relations: ['detailOrders'] });
		if (!order) throw new NotFoundException('Orden no encontrada');
		return order;
	}

	async update(id: number, dto: UpdateOrderDto) {
		const order = await this.findOne(id);
		Object.assign(order, {
			date: dto.date ? new Date(dto.date) : order.date,
			name_client: dto.name_client ?? order.name_client,
			telephone: dto.telephone ?? order.telephone,
			total: dto.total ?? order.total,
			state: dto.state ?? order.state,
			address: dto.address ?? order.address,
			method_pay: dto.method_pay ?? order.method_pay,
		});
		return this.ordersRepo.save(order);
	}

	async remove(id: number) {
		const order = await this.findOne(id);
		await this.ordersRepo.remove(order);
		return { message: 'Orden eliminada' };
	}
}
