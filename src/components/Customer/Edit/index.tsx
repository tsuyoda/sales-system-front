import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomerFormSchema from './validations';
import api from '../../../services/api';
import useStyles from './styles';
import PersonalInfo from '../SharedForms/PersonalInfo';
import PointsProgramInfo from '../SharedForms/PointsProgramInfo';
import { ICustomerEditForm, ICustomer } from '../../../interfaces/ICustomer';
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
  const [customerInfo, setCustomerInfo] = useState<ICustomerEditForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  useEffect(() => {
    api.get(`/customer/${id}`).then(async response => {
      const { data }: { data: ICustomer } = response.data;

      const res = data.address?.state
        ? await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.address.state}`)
        : null;

      const values: ICustomerEditForm = {
        customer_full_name: data.fullName,
        customer_doc_type: data.doc.type,
        customer_doc_id: data.doc.id,
        customer_contact_email: data.contact.email,
        customer_contact_tel: data.contact.tel,
        customer_address_street: data.address.street,
        customer_address_number: `${data.address.number}`,
        customer_address_complement: data.address.complement || '',
        customer_address_city: { label: data.address.city, value: data.address.city },
        customer_address_state: {
          label: (res && res.data?.nome) || '',
          value: data.address?.state || ''
        },
        customer_address_postal_code: data.address.postalCode,
        customer_participate_points_program: data.participatePointsProgram
      };

      setCustomerInfo(values);
      setLoading(false);
    });
  }, []);

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
      await api.put(`/customer/${id}`, customerPaylod);

      actions.setSubmitting(false);
      toast.success('Cliente atualizado com sucesso!');
      history.push('/customer');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na atualização do cliente: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na atualização do cliente`);
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label='Dados pessoais' />
            <Tab label='Programa de pontos' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <Formik initialValues={customerInfo} validationSchema={CustomerFormSchema} onSubmit={handleOnSubmit}>
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
