import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Post()
	create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateCategoryDto) {
		return this.categoryService.create(dto);
	}

	@UseGuards(AuthGuard)
	@Get()
	findAll() {
		return this.categoryService.findAll();
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.categoryService.findOne(id);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Put(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateCategoryDto,
	) {
		return this.categoryService.update(id, dto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.categoryService.remove(id);
	}
}
