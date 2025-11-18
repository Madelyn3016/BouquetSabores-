import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Column, ManyToOne, JoinColumn } from "typeorm";
import { Orders } from "./orders.entity";
import { Product } from "./product.entity";

@Entity({ name: 'detail_orders'})
export class DetailOrders {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, transformer: { to: (value: number) => value, from: (value: string | null) => (value === null ? null : parseFloat(value)) } })
    suubtotal: number;

    @Column()
    cantidad: number;

    @ManyToOne(() => Orders, (orders) => orders.detailOrders)
    @JoinColumn({ name: 'order_id' })
    order: Orders;

    @ManyToOne(() => Product, (product) => product.detailOrders)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}