import * as Yup from 'yup';

const CustomerFormSchema = Yup.object({
  customer_doc_id: Yup.string()
    .when('customer_doc_type', {
      is: 'F',
      then: Yup.string().min(11, 'CPF inválido').required('Campo de CPF é obrigatório')
    })
    .when('customer_doc_type', {
      is: 'J',
      then: Yup.string().min(14, 'CNPJ inválido').required('Campo de CNPJ é obrigatório')
    }),
  customer_full_name: Yup.string().min(3, 'Digite um nome válido').required('Campo obrigatório'),
  customer_contact_email: Yup.string()
    .email('Insira um e-mail válido')
    .required('Campo de e-mail de contato é obrigatório'),
  customer_contact_tel: Yup.string()
    .matches(/^\d{2}9?\d{8}$/, 'Número de telefone inválido')
    .required('Forneça ou número de telefone ou celular'),
  customer_address_postal_code: Yup.string().min(8, 'CEP inválido').required('Campo de CEP é obrigatório'),
  customer_address_state: Yup.object({
    value: Yup.string().required('Campo de estado obrigatório')
  }),
  customer_address_city: Yup.object({
    value: Yup.string().required('Campo de cidade obrigatório')
  }),
  customer_address_street: Yup.string().min(3, 'Digite um endereço válido').required('Campo de endereço é obrigatório'),
  customer_address_complement: Yup.string().optional(),
  customer_address_number: Yup.number().required('Campo de número é obrigatório'),
  customer_participate_points_program: Yup.boolean().required()
});

export default CustomerFormSchema;
