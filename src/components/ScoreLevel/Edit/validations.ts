import * as Yup from 'yup';

const BenefitFormSchema = Yup.object({
  score_level_name: Yup.string().required('Nome é obrigatório'),
  score_level_pointsThreshold: Yup.number()
    .min(0, 'Corte de pontuação deve ser positivo')
    .required('Corte de pontuação é obrigatório'),
  score_level_benefits: Yup.array().min(1, 'Necessário ter pelo menos 1 benefício').required()
});

export default BenefitFormSchema;
