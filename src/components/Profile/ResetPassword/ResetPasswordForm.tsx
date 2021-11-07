import { Form, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { IResetPasswordForm } from '../../../interfaces/IProfile';
import TextFormField from '../../Shared/FormFields/TextFormField';

function ResetPasswordForm() {
  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IResetPasswordForm>();

  const handleTextChange = (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, event.target.value);
  };

  return (
    <Form>
      <TextFormField
        type='password'
        label='Senha atual'
        variant='outlined'
        value={values.profile_currenct_password}
        onChange={handleTextChange('profile_currenct_password')}
        error={touched.profile_currenct_password && !!errors.profile_currenct_password}
        helperText={touched.profile_currenct_password && errors.profile_currenct_password}
        fullWidth
        style={{ marginBottom: 30 }}
        required
      />
      <TextFormField
        type='password'
        label='Nova senha'
        variant='outlined'
        value={values.profile_new_password}
        onChange={handleTextChange('profile_new_password')}
        error={touched.profile_new_password && !!errors.profile_new_password}
        helperText={touched.profile_new_password && errors.profile_new_password}
        fullWidth
        style={{ marginBottom: 30 }}
        required
      />
      <TextFormField
        type='password'
        label='Confirmar nova senha'
        variant='outlined'
        value={values.profile_new_password_confirmation}
        onChange={handleTextChange('profile_new_password_confirmation')}
        error={touched.profile_new_password_confirmation && !!errors.profile_new_password_confirmation}
        helperText={touched.profile_new_password_confirmation && errors.profile_new_password_confirmation}
        fullWidth
        style={{ marginBottom: 30 }}
        required
      />
    </Form>
  );
}

export default ResetPasswordForm;
