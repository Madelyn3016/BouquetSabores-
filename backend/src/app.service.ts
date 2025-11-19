import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Orders } from './entities/orders.entity';
import { DetailOrders } from './entities/detailOrders.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class DataLoaderInitial implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Orders) private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(DetailOrders) private readonly detailRepo: Repository<DetailOrders>,
  ) {}

  async onModuleInit() {
    const userCount = await this.userRepo.count();
    if (userCount === 0) {
      console.log('Cargando usuarios iniciales');
      const queryRunner = this.userRepo.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const filePath = path.resolve(__dirname, 'utils', 'user.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(rawData) as
          | Array<{ name: string; telephone: string | number; email: string; password: string; rol: string }>
          | { users: Array<{ name: string; telephone: string | number; email: string; password: string; rol: string }> };

        const source = Array.isArray(parsed) ? parsed : parsed.users;
        if (!Array.isArray(source)) {
          throw new Error('Formato inválido de utils/user.json: se esperaba un array o un objeto con propiedad "users"');
        }

        const repo = queryRunner.manager.getRepository(User);

        const entities = await Promise.all(
          source.map(async (user) => {
            const hashedPassword: string = bcrypt.hashSync(user.password, 10);
            return repo.create({
              name: user.name,
              telephone: String(user.telephone),
              email: user.email,
              password: hashedPassword,
              rol: user.rol,
            });
          }),
        );

        await repo.save(entities);
        await queryRunner.commitTransaction();
        console.log('Usuarios iniciales cargados correctamente');
      } catch (error) {
        console.error('Error cargando usuarios iniciales:', error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }else {
      console.log('Usuarios ya existen en la base de datos, no se cargan usuarios iniciales');
    }
    
    // Categorías
    if (await this.isEmpty(this.categoryRepo)) {
      const categories = this.readJsonArray('category.json', 'categories', [] as Array<any>);
      for (const c of categories) {
        const user = c.userEmail ? await this.userRepo.findOne({ where: { email: c.userEmail } }) : null;
        const entity = this.categoryRepo.create({
          name: c.name,
          description: c.description,
          user: user ?? undefined,
        });
        await this.categoryRepo.save(entity);
      }
    }

    // Productos
    if (await this.isEmpty(this.productRepo)) {
      const products = this.readJsonArray('product.json', 'products', [] as Array<any>);
      for (const p of products) {
        const user = p.userEmail ? await this.userRepo.findOne({ where: { email: p.userEmail } }) : null;
        const category = p.categoryName ? await this.categoryRepo.findOne({ where: { name: p.categoryName } }) : null;
        const entity = this.productRepo.create({
          name: p.name,
          description: p.description,
          price: Number(p.price),
          stock: Number(p.stock),
          image: p.image ?? '',
          user: user ?? undefined,
          category: category ?? undefined,
        });
        await this.productRepo.save(entity);
      }
    }

    // Órdenes
    if (await this.isEmpty(this.ordersRepo)) {
      const orders = this.readJsonArray('orders.json', 'orders', [] as Array<any>);
      for (const o of orders) {
        const entity = this.ordersRepo.create({
          date: new Date(o.date ?? new Date().toISOString()),
          name_client: o.name_client,
          telephone: String(o.telephone ?? ''),
          total: Number(o.total ?? 0),
          state: o.state ?? 'PENDIENTE',
          address: o.address ?? '',
          method_pay: o.method_pay ?? 'EFECTIVO',
        });
        await this.ordersRepo.save(entity);
      }
    }

    // Detalle de órdenes
    if (await this.isEmpty(this.detailRepo)) {
      const details = this.readJsonArray('detailOrders.json', 'details', [] as Array<any>);
      for (const d of details) {
        const product = d.productName ? await this.productRepo.findOne({ where: { name: d.productName } }) : null;
        const order = d.orderClientName ? await this.ordersRepo.findOne({ where: { name_client: d.orderClientName } }) : null;
        const entity = this.detailRepo.create({
          cantidad: Number(d.cantidad ?? 0),
          suubtotal: Number(d.suubtotal ?? 0),
          product: product ?? undefined,
          order: order ?? undefined,
        });
        await this.detailRepo.save(entity);
      }
    }
  }

  private async isEmpty(repo: Repository<any>) {
    return (await repo.count()) === 0;
  }

  private readJsonArray(fileName: string, key: string, fallback: any[]): any[] {
    try {
      const filePath = path.resolve(__dirname, 'utils', fileName);
      if (!fs.existsSync(filePath)) return fallback;
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed[key])) return parsed[key];
      return fallback;
    } catch {
      return fallback;
    }
  }
}
