import { PartialType } from '@nestjs/mapped-types';
import { CreateDetailOrderDto } from './createDetail-order.dto';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class UpdateDetailOrderDto extends PartialType(CreateDetailOrderDto) {
  @IsOptional()
  @IsNumber()
  suubtotal?: number;

  @IsOptional()
  @IsInt()
  cantidad?: number;

  @IsOptional()
  @IsInt()
  orderId?: number;

  @IsOptional()
  @IsInt()
  productId?: number;
}
