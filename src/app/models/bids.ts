export interface Bids {
    id?:string
    customer_id:string
    product_id:string
    merchant_id:string
    bid_rate_id:string
    bid_value:number
    bid_revenue:number 
    bid_swipe_action:string
    bid_status:string
    created_date?:string
    created_by?:string
    modified_date:string
}