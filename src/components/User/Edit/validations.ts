import * as Yup from 'yup';
import { validateCnpj, validateCpf } from '../../../utils/utiltsFunctions';

const UserFormSchema = Yup.object({
  user_email: Yup.string().email('Insira um e-mail válido').required('Campo de e-mail é obrigatório'),
  user_name: Yup.string()
    .matches(/^[\w.-]+$/, 'Usuário inválido')
    .lowercase()
    .required('Campo de usuário é obrigatório'),
  user_password: Yup.string()
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Senha deve conter no mínimo 8 carecteres, uma letra maiúscula, um número e um caracter especial'
    )
    .optional(),
  user_password_confirmation: Yup.string().when('user_password', {
    is: (user_password: string) => !!user_password,
    then: Yup.string()
      .oneOf([Yup.ref('user_password'), null], 'Senhas não conferem')
      .required('Confirmação de senha é obrigatório')
  }),
  user_role: Yup.object({
    value: Yup.string().required('Nível de acesso é obrigatório')
  }),
  user_doc_id: Yup.string()
    .when('user_doc_type', {
      is: 'F',
      then: Yup.string()
        .min(11, 'CPF inválido')
        .test('valid-cpf', 'CPF inválido', value => (value ? validateCpf(value) : true))
        .required('Campo de CPF é obrigatório')
    })
    .when('user_doc_type', {
      is: 'J',
      then: Yup.string()
        .min(14, 'CNPJ inválido')
        .test('valid-cnpj', 'CNPJ inválido', value => (value ? validateCnpj(value) : true))
        .required('Campo de CNPJ é obrigatório')
    }),
  user_full_name: Yup.string().min(3, 'Digite um nome válido').required('Campo obrigatório'),
  user_contact_email: Yup.string()
    .email('Insira um e-mail válido')
    .required('Campo de e-mail de contato é obrigatório'),
  user_contact_tel: Yup.string()
    .matches(/^\d{2}9?\d{8}$/, 'Número de telefone inválido')
    .required('Forneça ou número de telefone ou celular'),
  user_address_postal_code: Yup.string().min(8, 'CEP inválido').required('Campo de CEP é obrigatório'),
  user_address_state: Yup.object({
    value: Yup.string().required('Campo de estado obrigatório')
  }),
  user_address_city: Yup.object({
    value: Yup.string().required('Campo de cidade obrigatório')
  }),
  user_address_street: Yup.string().min(3, 'Digite um endereço válido').required('Campo de endereço é obrigatório'),
  user_address_complement: Yup.string().optional(),
  user_address_number: Yup.number().required('Campo de número é obrigatório')
});

export default UserFormSchema;
