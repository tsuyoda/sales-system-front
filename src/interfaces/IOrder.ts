import { IOption } from './IForm';
import { ICustomer } from './ICustomer';
import { ISeller } from './ISeller';
import { IProduct } from './IProduct';

export interface IOrderFilter {
  order_cod?: string;
  order_customer: IOption;
  order_seller: IOption;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOrderEditForm {
  order_search_customer_type: IOption;
  order_search_customer_value: string;
  order_customer?: ICustomer;
  order_customer_id: string;
  order_seller: IOption;
  order_insert_product: IOption;
  order_insert_product_quantity?: number;
  order_items: IOrderItem[];
  order_delivery_date: Date;
  order_payment_date: Date;
  order_comments: string;
  order_value_total_items: number;
  order_value_discount: number;
  order_value_total: number;
  order_insert_discount?: number;
  order_payment_method: IOption;
}

export interface IOrder {
  _id: string;
  cod: number;
  value: {
    totalDiscount: number;
    totalItems: number;
    total: number;
  };
  date: {
    delivery: string;
    payment: string;
  };
  status: string;
  customer: ICustomer;
  seller: ISeller;
  createdAt: string;
}

export interface IOrderFilterParams {
  cod?: number;
  seller?: string;
  customer?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IOrderItem {
  quantity: number;
  product: IProduct;
}
