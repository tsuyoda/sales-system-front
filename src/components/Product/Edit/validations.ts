import * as Yup from 'yup';

const ProductFormSchema = Yup.object({
  product_title: Yup.string().required('Título é obrigatório'),
  product_sku: Yup.string()
    .matches(/^[\w-]+$/, 'SKU inválido')
    .required('SKU é obrigatório'),
  product_provider: Yup.object({
    value: Yup.string().required('Fornecedor é obrigatório')
  })
    .required('Fornecedor é obrigatório')
    .nullable(),
  product_description: Yup.string().optional(),
  product_value: Yup.number().min(0.0, 'Valor deve ser maior ou igual a R$ 0,00').required('Valor é obrigatório'),
  product_quantity: Yup.number()
    .integer('Quantidade deve ser um número inteiro')
    .min(0, 'Quantidade deve ser maior ou igual a 0')
    .required('Quantidade é obrigatório'),
  product_measurement_unit_type: Yup.object({
    value: Yup.string().required('Tipo é obrigatório')
  })
    .required('Tipo é obrigatório')
    .nullable(),
  product_measurement_unit_value: Yup.number()
    .min(0.0, 'Valor deve ser maior ou igual a 0')
    .required('Valor é obrigatório'),
  product_height: Yup.number().min(0.0, 'Altura deve ser maior ou igual a 0').required('Altura é obrigatório'),
  product_width: Yup.number().min(0.0, 'Largura deve ser maior ou igual a 0').required('Largura é obrigatório'),
  product_length: Yup.number()
    .min(0.0, 'Comprimento deve ser maior ou igual a 0')
    .required('Comprimento é obrigatório'),
  product_weight: Yup.number().min(0.0, 'Peso deve ser maior ou igual a 0').required('Peso é obrigatório')
});

export default ProductFormSchema;
