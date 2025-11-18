import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepo: Repository<Product>,
	) {}

	create(dto: CreateProductDto) {
		const product = this.productRepo.create({
			name: dto.name,
			description: dto.description,
			price: dto.price,
			stock: dto.stock,
			image: dto.image ?? '',
			user: { id: dto.userId } as any,
			category: { id: dto.categoryId } as any,
		});
		return this.productRepo.save(product);
	}

	findAll() {
		return this.productRepo.find({ relations: ['user', 'category'] });
	}

	async findOne(id: number) {
		const product = await this.productRepo.findOne({ where: { id }, relations: ['user', 'category'] });
		if (!product) throw new NotFoundException('Producto no encontrado');
		return product;
	}

	async update(id: number, dto: UpdateProductDto) {
		const product = await this.findOne(id);
		if (dto.userId) (product as any).user = { id: dto.userId } as any;
		if (dto.categoryId) (product as any).category = { id: dto.categoryId } as any;
		Object.assign(product, {
			name: dto.name ?? product.name,
			description: dto.description ?? product.description,
			price: dto.price ?? product.price,
			stock: dto.stock ?? product.stock,
			image: dto.image ?? product.image,
		});
		return this.productRepo.save(product);
	}

	async remove(id: number) {
		const product = await this.findOne(id);
		await this.productRepo.remove(product);
		return { message: 'Producto eliminado' };
	}
}
