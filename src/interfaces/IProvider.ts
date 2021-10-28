import { IOption } from './IForm';
import { IPerson } from './IPerson';

export interface IProvider extends IPerson {
  _id: string;
  createdAt: string;
}

export interface IProviderEditForm {
  provider_full_name: string;
  provider_doc_type: string;
  provider_doc_id: string;
  provider_contact_email: string;
  provider_contact_tel: string;
  provider_address_street: string;
  provider_address_number: string;
  provider_address_complement?: string;
  provider_address_city: IOption;
  provider_address_postal_code: string;
  provider_address_state: IOption;
}

export interface IProviderFilterParams {
  fullName?: string;
  email?: string;
  doc?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IProviderFilter {
  provider_search_type: IOption;
  provider_search_value: string;
}
