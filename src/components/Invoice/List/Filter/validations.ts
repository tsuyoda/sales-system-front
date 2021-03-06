import * as Yup from 'yup';

const FilterUserSchema = Yup.object().shape({
  user_search_text: Yup.string()
    .nullable()
    .when('user_search_type.value', {
      is: 'user_email',
      then: Yup.string().email('Insira um e-mail válido')
    })
    .when('user_search_type.value', {
      is: 'user_name',
      then: Yup.string().min(3, 'Insira pelo menos 3 caracteres')
    })
});

export default FilterUserSchema;
