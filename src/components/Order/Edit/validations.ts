import * as Yup from 'yup';

const OrderFormSchema = Yup.object({
  order_customer_id: Yup.string().required('Cliente é obrigatório'),
  order_seller: Yup.object({
    value: Yup.string().required('Vendedor é obrigatório')
  })
    .nullable()
    .required('Vendedor é obrigatório'),
  order_payment_method: Yup.object({
    value: Yup.string().required('Forma de Pagamento é obrigatório')
  })
    .nullable()
    .required('Forma de Pagamento é obrigatório'),
  order_items: Yup.array().min(1, 'Necessário ter pelo menos 1 item').required(),
  order_delivery_date: Yup.date().typeError('Data inválida').required('Data de entrega é obrigatório').nullable(),
  order_payment_date: Yup.date().typeError('Data inválida').required('Data de pagamento é obrigatório').nullable()
});

export default OrderFormSchema;
