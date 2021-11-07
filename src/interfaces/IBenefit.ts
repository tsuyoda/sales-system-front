import { IOption } from './IForm';

export interface IBenefit {
  _id: string;
  name: string;
  description?: string;
  type: 'purchase_discount' | 'shipping_discount';
  value: number;
  createdAt: string;
}

export interface IBenefitFilterParams {
  name?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IBenefitFilterForm {
  benefit_search_name: string;
}

export interface IBenefitEditForm {
  benefit_name: string;
  benefit_type: IOption;
  benefit_value: number;
  benefit_description: string;
}
