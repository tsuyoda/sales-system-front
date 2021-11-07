import { Box, Button, IconButton } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import BenefitFormSchema from './validations';
import useStyles from './styles';
import api from '../../../services/api';
import { useHeaderTitle } from '../../../contexts/headerTitle';
import { INITIAL_FORM_VALUES } from '../../../constants/benefit';
import { IBenefitEditForm, IBenefit } from '../../../interfaces/IBenefit';
import BenefitInfo from '../Forms/BenefitInfo';

function Edit() {
  const classes = useStyles();
  const [benefitInfo, setBenefitInfo] = useState<IBenefitEditForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Edição de Benefício');
  }, []);

  useEffect(() => {
    api.get(`/benefit/${id}`).then(async response => {
      const { data }: { data: IBenefit } = response.data;

      const benefitTypeDict: { [key: string]: string } = {
        purchase_discount: 'Desconto em valor de compra',
        shipping_discount: 'Desconto em frete'
      };

      const values: IBenefitEditForm = {
        benefit_name: data.name,
        benefit_description: data.description || '',
        benefit_type: { value: data.type, label: benefitTypeDict[data.type] },
        benefit_value: data.value * 100
      };

      setBenefitInfo(values);
      setLoading(false);
    });
  }, []);

  const handleOnSubmit = useCallback(async (values: IBenefitEditForm, actions) => {
    const benefitPayload = {
      name: values.benefit_name,
      description: values.benefit_description,
      type: values.benefit_type.value,
      value: values.benefit_value / 100
    };

    try {
      await api.put(`/benefit/${id}`, benefitPayload);

      actions.setSubmitting(false);
      toast.success('Benefício atualizado com sucesso!');
      history.push('/benefit');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na atualização do benefício: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na atualização do benefício`);
        actions.setSubmitting(false);
      }
    }
  }, []);

  return loading ? null : (
    <>
      <div className={classes.tabs}>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
      </div>
      <div className={classes.content}>
        <Formik initialValues={benefitInfo} validationSchema={BenefitFormSchema} onSubmit={handleOnSubmit}>
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

export default Edit;
