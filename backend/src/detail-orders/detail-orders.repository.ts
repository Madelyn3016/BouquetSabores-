import { Injectable } from "@nestjs/common";

@Injectable()
export class DetailOrdersRepository {
    getAllOrders(){
        return "Detalle de ordenes";
    }
}