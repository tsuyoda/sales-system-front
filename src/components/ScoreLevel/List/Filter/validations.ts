import * as Yup from 'yup';

const FilterBenefitSchema = Yup.object().shape({
  benefit_search_name: Yup.string().min(5, 'Necessário mínimo de 5 caracteres')
});

export default FilterBenefitSchema;
