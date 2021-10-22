import * as Yup from 'yup';

const RoleFormSchema = Yup.object({
  role_name: Yup.string()
    .matches(/^[\w\s]+$/, 'São permitidos apenas letras, números e underscore')
    .required('Campo de nome é obrigatório')
});

export default RoleFormSchema;
