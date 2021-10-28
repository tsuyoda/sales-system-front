import { IOption } from './IForm';

export interface IProduct {
  _id: string;
  sku: string;
  title: string;
  description?: string;
  value: number;
  quantity: number;
  measurementUnit: {
    type: string;
    value: number;
  };
  length: number;
  width: number;
  height: number;
  weight: number;
  provider: string;
  createdAt: string;
}

export interface IProductHistoryPrice {
  _id: string;
  value: number;
  product: string;
  createdAt: string;
}

export interface IProductFilterParams {
  title?: string;
  provider?: string;
  sku?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IProductFilterForm {
  product_search_type: IOption;
  product_search_value: string;
  product_search_provider: IOption;
}

export interface IProductEditForm {
  product_sku: string;
  product_title: string;
  product_description: string;
  product_value: number;
  product_provider: IOption;
  product_quantity: number;
  product_measurement_unit_type: IOption;
  product_measurement_unit_value: number;
  product_length: number;
  product_width: number;
  product_height: number;
  product_weight: number;
}
