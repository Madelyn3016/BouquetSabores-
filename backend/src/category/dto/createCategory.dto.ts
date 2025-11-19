import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Pasteles', description: 'Nombre de la categoría' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Pasteles y tortas personalizadas', description: 'Descripción de la categoría' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 1, description: 'ID del usuario creador de la categoría' })
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
