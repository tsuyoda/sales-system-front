import { IOption } from './IForm';

export interface IRole {
  _id: string;
  name: string;
  description: string;
}

export interface IUser {
  _id: string;
  name: string;
  fullName: string;
  email: string;
  role: IRole;
  createdAt: string;
}

export interface IUserFilter {
  user_search_type: IOption;
  user_search_text: string;
  user_search_rule: IOption[];
}

export interface IUserRegisterForm {
  user_email: string;
  user_full_name: string;
  user_password?: string;
  user_role: IOption;
  user_name: string;
  user_doc_type: string;
  user_doc_id: string;
  user_contact_email: string;
  user_contact_tel: string;
  user_address_street: string;
  user_address_number: string;
  user_address_complement?: string;
  user_address_city: IOption;
  user_address_postal_code: string;
  user_address_state: IOption;
}

export interface IUserFilterParams {
  email?: string;
  name?: string;
  role?: {
    name?: string[];
  };
  page?: number;
  limit?: number;
}
