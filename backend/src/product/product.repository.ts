import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepository {
    getAllProducts(){
        return "Lista de productos";
    }
}