import { IOption } from './IForm';
import { IPerson } from './IPerson';

export interface ICustomer extends IPerson {
  _id: string;
  participatePointsProgram: boolean;
  createdAt: string;
}

export interface ICustomerEditForm {
  customer_full_name: string;
  customer_doc_type: string;
  customer_doc_id: string;
  customer_contact_email: string;
  customer_contact_tel: string;
  customer_address_street: string;
  customer_address_number: string;
  customer_address_complement?: string;
  customer_address_city: IOption;
  customer_address_postal_code: string;
  customer_address_state: IOption;
  customer_participate_points_program: boolean;
}

export interface ICustomerFilterParams {
  fullName?: string;
  email?: string;
  doc?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ICustomerFilter {
  customer_search_type: IOption;
  customer_search_value: string;
}
