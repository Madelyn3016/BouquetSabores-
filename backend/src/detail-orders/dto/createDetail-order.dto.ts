import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetailOrderDto {
  @ApiProperty({ example: 45000, description: 'Subtotal del ítem (precio * cantidad)' })
  @IsNotEmpty()
  @IsNumber()
  suubtotal: number; // mantenemos nombre del entity

  @ApiProperty({ example: 3, description: 'Cantidad de unidades del producto' })
  @IsNotEmpty()
  @IsInt()
  cantidad: number;

  @ApiProperty({ example: 1, description: 'ID de la orden a la que pertenece' })
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @ApiProperty({ example: 2, description: 'ID del producto' })
  @IsNotEmpty()
  @IsInt()
  productId: number;
}
