import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepository {
    getAllUsers(){
        return "Lista de usuarios";
    }
}