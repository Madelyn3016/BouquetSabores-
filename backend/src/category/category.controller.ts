import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Crear categoría', description: 'Solo admin. Crea una categoría nueva' })
	@ApiResponse({ status: 201, description: 'Categoría creada exitosamente' })
	@ApiResponse({ status: 403, description: 'Acceso denegado (requiere rol admin)' })
	@ApiBody({ type: CreateCategoryDto })
	create(@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateCategoryDto) {
		return this.categoryService.create(dto);
	}

	@Get()
	@ApiOperation({ summary: 'Listar categorías', description: 'Público. Retorna todas las categorías' })
	@ApiResponse({ status: 200, description: 'Lista de categorías' })
	findAll() {
		return this.categoryService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Obtener categoría por ID', description: 'Público' })
	@ApiResponse({ status: 200, description: 'Categoría encontrada' })
	@ApiResponse({ status: 404, description: 'Categoría no encontrada' })
	@ApiParam({ name: 'id', example: 1 })
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.categoryService.findOne(id);
	}

	@Put(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Actualizar categoría', description: 'Solo admin. Actualiza datos de la categoría' })
	@ApiResponse({ status: 200, description: 'Categoría actualizada' })
	@ApiResponse({ status: 404, description: 'Categoría no encontrada' })
	@ApiParam({ name: 'id', example: 1 })
	@ApiBody({ type: UpdateCategoryDto })
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(new ValidationPipe({ whitelist: true, transform: true })) dto: UpdateCategoryDto,
	) {
		return this.categoryService.update(id, dto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RolesEnum.ADMIN)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Eliminar categoría', description: 'Solo admin. Elimina una categoría por ID' })
	@ApiResponse({ status: 200, description: 'Categoría eliminada exitosamente' })
	@ApiResponse({ status: 404, description: 'Categoría no encontrada' })
	@ApiParam({ name: 'id', example: 1 })
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.categoryService.remove(id);
	}
}
