import { IOption } from './IForm';

export interface IProfileForm {
  profile_email: string;
  profile_full_name: string;
  profile_role: IOption;
  profile_name: string;
  profile_doc_type: string;
  profile_doc_id: string;
  profile_contact_email: string;
  profile_contact_tel: string;
  profile_address_street: string;
  profile_address_number: string;
  profile_address_complement?: string;
  profile_address_city: IOption;
  profile_address_postal_code: string;
  profile_address_state: IOption;
  profile_is_seller: boolean;
  profile_seller_comission: number;
  profile_seller_max_discount: number;
}

export interface IResetPasswordForm {
  profile_currenct_password: string;
  profile_new_password: string;
  profile_new_password_confirmation: string;
}
