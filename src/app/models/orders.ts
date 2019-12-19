import { Product } from "./product";

export interface Tracking {
    title: string
    text: string
    icon: string
    time: string
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface TacOrder {
    carts: CartItem[]
    currency_used: string
    transaction_id: string
    id: string
    country: string
    email: string
    created_date: string
    track_id: number
    status: string
    total_amount: number
    shipping_details: any
    other_payment_detals:any
    gift_card_style: string
    tracking_details: Tracking[]
}


// address
// "20 Eyo Street Palmgroove"
// card_message
// "hello"
// country
// "Nigeria"
// email
// "gisanrinadetayo@gmail.com"
// firstname
// "ADETAYO"
// fullname
// "ADETAYO GISANRIN"
// lastname
// "GISANRIN"
// phone
// "8100865962"
// recipientphone
// "8100865962"
// (string)
// specialinstructions
// ""
// state
// "Lagos"
// town
// "Somolu"