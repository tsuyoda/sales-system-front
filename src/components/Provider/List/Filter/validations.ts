import * as Yup from 'yup';

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
      then: Yup.string().min(11, 'CPF inválido')
    })
    .when('provider_search_type.value', {
      is: 'provider_doc_j',
      then: Yup.string().min(14, 'CNPJ inválido')
    })
});

export default FilterProviderSchema;
