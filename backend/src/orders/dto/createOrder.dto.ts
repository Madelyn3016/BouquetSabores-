import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: '2025-11-18T10:30:00Z', description: 'Fecha de la orden' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'María González', description: 'Nombre del cliente' })
  @IsNotEmpty()
  @IsString()
  name_client: string;

  @ApiProperty({ example: '3109876543', description: 'Teléfono del cliente' })
  @IsNotEmpty()
  @IsString()
  telephone: string;

  @ApiProperty({ example: 120000, description: 'Total de la orden en pesos' })
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @ApiProperty({ example: 'PENDIENTE', description: 'Estado de la orden', enum: ['PENDIENTE', 'EN_PROCESO', 'ENTREGADO', 'CANCELADO'] })
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty({ example: 'Calle 123 # 45-67, Bogotá', description: 'Dirección de entrega' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'EFECTIVO', description: 'Método de pago', enum: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'] })
  @IsNotEmpty()
  @IsString()
  method_pay: string;
}
