import * as Yup from 'yup';
import { validateCnpj, validateCpf } from '../../../../utils/utiltsFunctions';

const FilterProviderSchema = Yup.object().shape({
  provider_search_value: Yup.string()
    .nullable()
    .when('provider_search_type.value', {
      is: 'provider_email',
      then: Yup.string().email('Insira um e-mail válido')
    })
    .when('provider_search_type.value', {
      is: 'provider_name',
      then: Yup.string().min(3, 'Insira pelo menos 3 caracteres')
    })
    .when('provider_search_type.value', {
      is: 'provider_doc_f',
      then: Yup.string()
        .min(11, 'CPF inválido')
        .test('valid-cpf', 'CPF inválido', value => (value ? validateCpf(value) : true))
    })
    .when('provider_search_type.value', {
      is: 'provider_doc_j',
      then: Yup.string()
        .min(14, 'CNPJ inválido')
        .test('valid-cnpj', 'CNPJ inválido', value => (value ? validateCnpj(value) : true))
    })
});

export default FilterProviderSchema;
