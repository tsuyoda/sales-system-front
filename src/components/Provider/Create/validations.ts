import * as Yup from 'yup';

const ProviderFormSchema = Yup.object({
  provider_doc_id: Yup.string()
    .when('provider_doc_type', {
      is: 'F',
      then: Yup.string().min(11, 'CPF inválido').required('Campo de CPF é obrigatório')
    })
    .when('provider_doc_type', {
      is: 'J',
      then: Yup.string().min(14, 'CNPJ inválido').required('Campo de CNPJ é obrigatório')
    }),
  provider_full_name: Yup.string().min(3, 'Digite um nome válido').required('Campo obrigatório'),
  provider_contact_email: Yup.string()
    .email('Insira um e-mail válido')
    .required('Campo de e-mail de contato é obrigatório'),
  provider_contact_tel: Yup.string()
    .matches(/^\d{2}9?\d{8}$/, 'Número de telefone inválido')
    .required('Forneça ou número de telefone ou celular'),
  provider_address_postal_code: Yup.string().min(8, 'CEP inválido').required('Campo de CEP é obrigatório'),
  provider_address_state: Yup.object({
    value: Yup.string().required('Campo de estado obrigatório')
  }),
  provider_address_city: Yup.object({
    value: Yup.string().required('Campo de cidade obrigatório')
  }),
  provider_address_street: Yup.string().min(3, 'Digite um endereço válido').required('Campo de endereço é obrigatório'),
  provider_address_complement: Yup.string().optional(),
  provider_address_number: Yup.number().required('Campo de número é obrigatório')
});

export default ProviderFormSchema;
