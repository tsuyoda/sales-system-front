import * as Yup from 'yup';

const BenefitFormSchema = Yup.object({
  benefit_name: Yup.string().required('Nome é obrigatório'),
  benefit_value: Yup.number()
    .min(0, 'Valor deve ser entre 0% e 100%')
    .max(100, 'Valor deve ser entre 0% e 100%')
    .required('Valor é obrigatório')
});

export default BenefitFormSchema;
