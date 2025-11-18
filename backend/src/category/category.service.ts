import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Injectable()
export class CategoryService {
	constructor(
		@InjectRepository(Category)
		private readonly categoryRepo: Repository<Category>,
	) {}

	create(dto: CreateCategoryDto) {
		const category = this.categoryRepo.create({
			name: dto.name,
			description: dto.description,
			user: { id: dto.userId } as any,
		});
		return this.categoryRepo.save(category);
	}

	findAll() {
		return this.categoryRepo.find({ relations: ['user'] });
	}

	async findOne(id: number) {
		const category = await this.categoryRepo.findOne({ where: { id }, relations: ['user'] });
		if (!category) throw new NotFoundException('Categoría no encontrada');
		return category;
	}

	async update(id: number, dto: UpdateCategoryDto) {
		const category = await this.findOne(id);
		if (dto.userId) (category as any).user = { id: dto.userId } as any;
		Object.assign(category, {
			name: dto.name ?? category.name,
			description: dto.description ?? category.description,
		});
		return this.categoryRepo.save(category);
	}

	async remove(id: number) {
		const category = await this.findOne(id);
		await this.categoryRepo.remove(category);
		return { message: 'Categoría eliminada' };
	}
}
