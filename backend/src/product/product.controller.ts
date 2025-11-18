import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Post()
	create(
		@Body(new ValidationPipe({ whitelist: true, transform: true }))
		dto: CreateProductDto,
	) {
		return this.productService.create(dto);
	}

	@UseGuards(AuthGuard)
	@Get()
	findAll() {
		return this.productService.findAll();
	}

	@UseGuards(AuthGuard)
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.productService.findOne(id);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Put(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateProductDto,
	) {
		return this.productService.update(id, dto);
	}

	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.productService.remove(id);
	}
}
