import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Torta de Chocolate', description: 'Nombre del producto' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Deliciosa torta de chocolate con relleno cremoso', description: 'Descripción detallada del producto' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 45000, description: 'Precio del producto en pesos' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 15, description: 'Cantidad disponible en inventario' })
  @IsNotEmpty()
  @IsInt()
  stock: number;

  @ApiPropertyOptional({ example: 'https://example.com/torta.jpg', description: 'URL de la imagen del producto' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ example: 1, description: 'ID del usuario creador del producto' })
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @ApiProperty({ example: 2, description: 'ID de la categoría del producto' })
  @IsNotEmpty()
  @IsInt()
  categoryId: number;
}
