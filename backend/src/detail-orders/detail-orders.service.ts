import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetailOrders } from '../entities/detailOrders.entity';
import { CreateDetailOrderDto } from './dto/createDetail-order.dto';
import { UpdateDetailOrderDto } from './dto/updateDetail-order.dto';

@Injectable()
export class DetailOrdersService {
	constructor(
		@InjectRepository(DetailOrders)
		private readonly detailRepo: Repository<DetailOrders>,
	) {}

	create(dto: CreateDetailOrderDto) {
		const entity = this.detailRepo.create({
			suubtotal: dto.suubtotal,
			cantidad: dto.cantidad,
			order: { id: dto.orderId } as any,
			product: { id: dto.productId } as any,
		});
		return this.detailRepo.save(entity);
	}

	findAll() {
		return this.detailRepo.find({ relations: ['order', 'product'] });
	}

	async findOne(id: number) {
		const entity = await this.detailRepo.findOne({ where: { id }, relations: ['order', 'product'] });
		if (!entity) throw new NotFoundException('Detalle no encontrado');
		return entity;
	}

	async update(id: number, dto: UpdateDetailOrderDto) {
		const entity = await this.findOne(id);
		if (dto.orderId) (entity as any).order = { id: dto.orderId } as any;
		if (dto.productId) (entity as any).product = { id: dto.productId } as any;
		Object.assign(entity, {
			suubtotal: dto.suubtotal ?? entity.suubtotal,
			cantidad: dto.cantidad ?? entity.cantidad,
		});
		return this.detailRepo.save(entity);
	}

	async remove(id: number) {
		const entity = await this.findOne(id);
		await this.detailRepo.remove(entity);
		return { message: 'Detalle eliminado' };
	}
}
