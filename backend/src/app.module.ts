import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { DetailOrdersModule } from './detail-orders/detail-orders.module';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { DataLoaderInitial } from './app.service';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Orders } from './entities/orders.entity';
import { DetailOrders } from './entities/detailOrders.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      load: [typeorm] 
    }),
  TypeOrmModule.forRootAsync({inject: [ConfigService], useFactory: (config: ConfigService) => config.get('typeorm') ?? {}}),
  TypeOrmModule.forFeature([User, Category, Product, Orders, DetailOrders]),
    UserModule, ProductModule, CategoryModule, DetailOrdersModule, OrdersModule, AuthModule, JwtModule.register({global: true, secret: process.env.JWT_SECRET, signOptions: {expiresIn: '1h'}})],
  controllers: [AppController],
  providers: [AppService, DataLoaderInitial],
})
export class AppModule {}
