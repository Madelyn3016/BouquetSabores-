import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDetailOrderDto {
  @IsNotEmpty()
  @IsNumber()
  suubtotal: number; // mantenemos nombre del entity

  @IsNotEmpty()
  @IsInt()
  cantidad: number;

  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @IsNotEmpty()
  @IsInt()
  productId: number;
}
