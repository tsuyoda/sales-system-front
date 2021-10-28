import * as Yup from 'yup';

const FilterCustomerSchema = Yup.object().shape({
  customer_search_value: Yup.string()
    .nullable()
    .when('customer_search_type.value', {
      is: 'customer_email',
      then: Yup.string().email('Insira um e-mail válido')
    })
    .when('customer_search_type.value', {
      is: 'customer_name',
      then: Yup.string().min(3, 'Insira pelo menos 3 caracteres')
    })
    .when('customer_search_type.value', {
      is: 'customer_doc_f',
      then: Yup.string().min(11, 'CPF inválido')
    })
    .when('customer_search_type.value', {
      is: 'customer_doc_j',
      then: Yup.string().min(14, 'CNPJ inválido')
    })
});

export default FilterCustomerSchema;
