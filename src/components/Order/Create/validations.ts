import * as Yup from 'yup';
import { validateCnpj, validateCpf } from '../../../utils/utiltsFunctions';

const OrderFormSchema = Yup.object({
  order_search_customer_value: Yup.string()
    .when('order_search_customer_type.value', {
      is: 'customer_doc_f',
      then: Yup.string()
        .min(11, 'CPF inválido')
        .test('valid-cpf', 'CPF inválido', value => (value ? validateCpf(value) : true))
    })
    .when('order_search_customer_type.value', {
      is: 'customer_doc_j',
      then: Yup.string()
        .min(14, 'CNPJ inválido')
        .test('valid-cnpj', 'CNPJ inválido', value => (value ? validateCnpj(value) : true))
    }),
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
  order_value_delivery: Yup.number()
    .min(0.0, 'Valor deve ser maior ou igual a R$ 0,00')
    .required('Valor é obrigatório'),
  order_payment_date: Yup.date().typeError('Data inválida').required('Data de pagamento é obrigatório').nullable()
});

export default OrderFormSchema;
