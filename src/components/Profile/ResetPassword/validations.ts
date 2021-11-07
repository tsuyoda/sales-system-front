import * as Yup from 'yup';

const PasswordFormSchema = Yup.object({
  profile_currenct_password: Yup.string().required('Senha atual é obrigatória'),
  profile_new_password: Yup.string()
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Senha deve conter no mínimo 8 carecteres, uma letra maiúscula, um número e um caracter especial'
    )
    .required('Nova senha é obrigatório'),
  profile_new_password_confirmation: Yup.string().oneOf([Yup.ref('profile_new_password'), null], 'Senhas não conferem')
});

export default PasswordFormSchema;
