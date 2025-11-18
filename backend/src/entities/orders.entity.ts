import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DetailOrders } from "./detailOrders.entity";

@Entity({ name: 'orders'})
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    date: Date;

    @Column()
    name_client: string;

    @Column()
    telephone: string;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, transformer: { to: (value: number) => value, from: (value: string | null) => (value === null ? null : parseFloat(value)) } })
    total: number;

    @Column()
    state: string;

    @Column()
    address: string;

    @Column()
    method_pay: string;

    @OneToMany(() => DetailOrders, (detailOrders) => detailOrders.order)
    detailOrders: DetailOrders[];
}