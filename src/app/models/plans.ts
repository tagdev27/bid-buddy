export interface Subscriptions {
    id:string
    paystack_plan_id:string
    title:string
    description:string
    icon:string
    minimum_users:number
    monthly_price:number
    yearly_price:number
    features:Features[]
    created_date:string
    created_by:string
    modified_date:string
}

export interface Features {
    display:string
    value:string
}