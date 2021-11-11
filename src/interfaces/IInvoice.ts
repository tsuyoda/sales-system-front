import { IOrder } from './IOrder';
import { ICustomer } from './ICustomer';
import { IOption } from './IForm';

export interface IInvoiceFilterForm {
  invoice_order_cod?: string;
  invoice_customer: IOption;
}

export interface IInvoiceItem {
  title: string;
  sku: string;
  quantity: number;
  value: {
    unitary: number;
    subtotal: number;
  };
  product: string;
}

export interface IInvoiceFilterParams {
  orderCod?: string;
  customer?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface IInvoiceRecipient {
  name: string;
  cpfCnpj: string;
  address: {
    street: string;
    number: number;
    complement?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  contact: {
    tel: string;
  };
}

interface IInvoiceValue {
  totalItems: number;
  totalDiscount: number;
  freight: number;
  baseICMS: number;
  totalICMS: number;
  total: number;
}

export interface IInvoice {
  _id: string;
  recipient: IInvoiceRecipient;
  paymentType: string;
  value: IInvoiceValue;
  order: IOrder;
  customer: ICustomer;
  items: IInvoiceItem[];
  dispatchedAt: string;
  createdAt: string;
}
