// Product
export interface Product {
  id?: string;
  name?: string;
  price?: number;
  pictures?: string[];
  description?: string;
  deliver_type?: string;
  category_id?: string;
  merchant_id?:string;
  status?:boolean;
  start_time?: any;
  end_time?: any;
  coupon_code:string;
  coupon_value_type:string;
  coupon_value?:number;
  created_date?: string;
  modified_date?: string;
  created_by?: string;
  dynamic_link?: string;
  deleted?: boolean;
  rating?: number;
}

export interface MerchantItem {
  display: string
  value:string
  id:string
}