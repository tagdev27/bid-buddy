import { Product } from "./product";

export interface CartItem {
    id:string
    email:string
    country:string
    quantity:number
    product:Product
    created_date:string
}