import { Injectable } from "@nestjs/common";

@Injectable()
export class CategoryRepository {
    getAllCategories(){
        return "Lista de categorias";
    }
}