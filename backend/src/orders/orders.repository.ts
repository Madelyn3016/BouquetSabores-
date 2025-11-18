import { Injectable } from "@nestjs/common";

@Injectable()
export class OrdersRepository {
    getAllOrders(){
        return "Lista de ordenes";
    }
}