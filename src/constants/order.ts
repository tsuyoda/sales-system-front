// eslint-disable-next-line import/prefer-default-export
export const INITIAL_FILTER_VALUES = {
  order_cod: '',
  order_customer: { label: '', value: '' },
  order_seller: { label: '', value: '' }
};

export const INITIAL_FORM_VALUES = {
  order_search_customer_type: { label: 'CPF', value: 'customer_doc_f' },
  order_search_customer_value: '',
  order_insert_product: { label: '', value: '' },
  order_seller: { label: '', value: '' },
  order_customer_id: '',
  order_items: [],
  order_comments: '',
  order_delivery_date: new Date(),
  order_payment_date: new Date(),
  order_value_total_items: 0,
  order_value_discount: 0,
  order_value_total: 0,
  order_payment_method: { label: '', value: '' }
};
