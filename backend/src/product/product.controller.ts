import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('products')
@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Crear producto', description: 'Solo admin. Crea un producto nuevo' })
	@ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
	@ApiResponse({ status: 403, description: 'Acceso denegado (requiere rol admin)' })
	@ApiBody({ type: CreateProductDto })
	create(
		@Body(new ValidationPipe({ whitelist: true, transform: true }))
		dto: CreateProductDto,
	) {
		return this.productService.create(dto);
	}

	@Get()
	@UseGuards(AuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Listar productos', description: 'Requiere autenticación. Retorna todos los productos' })
	@ApiResponse({ status: 200, description: 'Lista de productos' })
	findAll() {
		return this.productService.findAll();
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Obtener producto por ID', description: 'Requiere autenticación' })
	@ApiResponse({ status: 200, description: 'Producto encontrado' })
	@ApiResponse({ status: 404, description: 'Producto no encontrado' })
	@ApiParam({ name: 'id', example: 1 })
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.productService.findOne(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Actualizar producto', description: 'Solo admin. Actualiza datos del producto' })
	@ApiResponse({ status: 200, description: 'Producto actualizado' })
	@ApiResponse({ status: 404, description: 'Producto no encontrado' })
	@ApiParam({ name: 'id', example: 1 })
	@ApiBody({ type: UpdateProductDto })
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateProductDto,
	) {
		return this.productService.update(id, dto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Eliminar producto', description: 'Solo admin. Elimina un producto por ID' })
	@ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
	@ApiResponse({ status: 404, description: 'Producto no encontrado' })
	@ApiParam({ name: 'id', example: 1 })
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.productService.remove(id);
	}
}
