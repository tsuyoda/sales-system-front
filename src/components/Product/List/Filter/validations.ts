import * as Yup from 'yup';

const FilterProductSchema = Yup.object().shape({
  product_search_value: Yup.string()
    .nullable()
    .when('product_search_type.value', {
      is: 'product_title',
      then: Yup.string().min(3, 'Título deve conter pelo menos 3 letras')
    })
    .when('product_search_type.value', {
      is: 'product_sku',
      then: Yup.string().matches(/^[\w-]+$/, 'Insira um SKU válido')
    })
});

export default FilterProductSchema;
