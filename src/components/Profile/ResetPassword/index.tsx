import { Button, Container, IconButton } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import PasswordFormSchema from './validations';
import useStyles from './styles';
import { useHeaderTitle } from '../../../contexts/headerTitle';
import ResetPasswordForm from './ResetPasswordForm';
import { IResetPasswordForm } from '../../../interfaces/IProfile';
import api from '../../../services/api';

function ResetPassword() {
  const classes = useStyles();

  const history = useHistory();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Redefinição de senha');
  }, []);

  const initialValues = {
    profile_currenct_password: '',
    profile_new_password: '',
    profile_new_password_confirmation: ''
  };

  const handleOnSubmit = useCallback(async (values: IResetPasswordForm, actions) => {
    const passwordPayload = {
      currentPassword: values.profile_currenct_password,
      newPassword: values.profile_new_password
    };

    try {
      await api.post('/profile/reset-password', passwordPayload);

      actions.setSubmitting(false);
      toast.success('Senha atualizada com sucesso!');
      history.push('/profile');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na atualização da senha: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na atualização da senha`);
        actions.setSubmitting(false);
      }
    }
  }, []);

  return (
    <>
      <div>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </div>
      <div className={classes.content}>
        <Formik initialValues={initialValues} validationSchema={PasswordFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IResetPasswordForm>) => (
            <Form>
              <Container
                component='div'
                maxWidth='xs'
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <ResetPasswordForm />
                <Button
                  color='secondary'
                  variant='contained'
                  type='submit'
                  disabled={!isValid || isSubmitting}
                  startIcon={<SaveIcon />}
                  fullWidth
                >
                  Salvar
                </Button>
              </Container>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default ResetPassword;
