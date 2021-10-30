import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CustomerFormSchema from './validations';
import api from '../../../services/api';
import useStyles from './styles';
import PersonalInfo from '../Forms/PersonalInfo';
import PointsProgramInfo from '../Forms/PointsProgramInfo';
import { ICustomerEditForm } from '../../../interfaces/ICustomer';
import { INITIAL_FORM_VALUES } from '../../../constants/customer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...props }: TabPanelProps) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...props}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function Register() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const history = useHistory();

  const handleTabChange = useCallback((event, value) => {
    setTabValue(value);
  }, []);

  const handleOnSubmit = useCallback(async (values: ICustomerEditForm, actions) => {
    const customerPaylod = {
      fullName: values.customer_full_name,
      doc: {
        id: values.customer_doc_id,
        type: values.customer_doc_type
      },
      contact: {
        email: values.customer_contact_email,
        tel: values.customer_contact_tel
      },
      address: {
        street: values.customer_address_street,
        number: values.customer_address_number,
        complement: values.customer_address_complement,
        city: values.customer_address_city.value,
        postalCode: values.customer_address_postal_code,
        state: values.customer_address_state.value
      },
      participatePointsProgram: values.customer_participate_points_program
    };

    try {
      await api.post('/customer', customerPaylod);

      actions.setSubmitting(false);
      toast.success('Cliente criado com sucesso!');
      history.push('/customer');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na criação do cliente: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na criação do cliente`);
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label='Dados pessoais' />
            <Tab label='Programa de pontos' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={CustomerFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<ICustomerEditForm>) => (
            <Form>
              <div className={classes.formContainer}>
                <TabPanel value={tabValue} index={0}>
                  <PersonalInfo />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <PointsProgramInfo />
                </TabPanel>
              </div>

              <div className={classes.footerButtons}>
                {tabValue === 0 ? (
                  <Button color='primary' variant='contained' onClick={() => setTabValue(1)}>
                    Próximo
                  </Button>
                ) : (
                  <Button color='primary' variant='contained' onClick={() => setTabValue(0)}>
                    Anterior
                  </Button>
                )}
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
