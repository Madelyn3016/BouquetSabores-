import { Module } from '@nestjs/common';
import { DetailOrdersController } from './detail-orders.controller';
import { DetailOrdersService } from './detail-orders.service';
import { DetailOrdersRepository } from './detail-orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetailOrders } from '../entities/detailOrders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetailOrders])],
  controllers: [DetailOrdersController],
  providers: [DetailOrdersService, DetailOrdersRepository]
})
export class DetailOrdersModule {}
