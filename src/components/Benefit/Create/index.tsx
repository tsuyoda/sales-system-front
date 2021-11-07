import { Box, Button, IconButton } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import BenefitFormSchema from './validations';
import useStyles from './styles';
import api from '../../../services/api';
import { useHeaderTitle } from '../../../contexts/headerTitle';
import { INITIAL_FORM_VALUES } from '../../../constants/benefit';
import { IBenefitEditForm } from '../../../interfaces/IBenefit';
import BenefitInfo from '../Forms/BenefitInfo';

function Register() {
  const classes = useStyles();

  const history = useHistory();
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Cadastro de Benefício');
  }, []);

  const handleOnSubmit = useCallback(async (values: IBenefitEditForm, actions) => {
    const benefitPayload = {
      name: values.benefit_name,
      description: values.benefit_description,
      type: values.benefit_type.value,
      value: values.benefit_value / 100
    };

    try {
      await api.post('/benefit', benefitPayload);

      actions.setSubmitting(false);
      toast.success('Benefício criado com sucesso!');
      history.push('/benefit');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na criação do benefício: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na criação do benefício`);
        actions.setSubmitting(false);
      }
    }
  }, []);

  return (
    <>
      <div className={classes.tabs}>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
      </div>
      <div className={classes.content}>
        <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={BenefitFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IBenefitEditForm>) => (
            <Form>
              <div className={classes.formContainer}>
                <BenefitInfo />
              </div>

              <div className={classes.footerButtons}>
                <Button
                  className={classes.saveButton}
                  color='secondary'
                  variant='contained'
                  type='submit'
                  disabled={!isValid || isSubmitting}
                  startIcon={<SaveIcon />}
                >
                  Salvar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Register;
