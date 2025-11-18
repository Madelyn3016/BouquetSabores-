import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";
import { Category } from "./category.entity";
import { DetailOrders } from "./detailOrders.entity";

@Entity({ name: 'product'})
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, transformer: { to: (value: number) => value, from: (value: string | null) => (value === null ? null : parseFloat(value)) } })
    price: number;

    @Column()
    stock: number;

    @Column()
    image: string;

    @ManyToOne(() => User, (user) => user.products)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @OneToMany(() => DetailOrders, (detailOrders) => detailOrders.product)
    detailOrders: DetailOrders[];
}