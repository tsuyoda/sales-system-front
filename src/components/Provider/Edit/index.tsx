import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import ProviderFormSchema from './validations';
import api from '../../../services/api';
import useStyles from './styles';
import PersonalInfo from '../Forms/PersonalInfo';
import { IProviderEditForm, IProvider } from '../../../interfaces/IProvider';
import { INITIAL_FORM_VALUES } from '../../../constants/provider';

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
  const [providerInfo, setProviderInfo] = useState<IProviderEditForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  useEffect(() => {
    api.get(`/provider/${id}`).then(async response => {
      const { data }: { data: IProvider } = response.data;

      const res = data.address?.state
        ? await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.address.state}`)
        : null;

      const values: IProviderEditForm = {
        provider_full_name: data.fullName,
        provider_doc_type: data.doc.type,
        provider_doc_id: data.doc.id,
        provider_contact_email: data.contact.email,
        provider_contact_tel: data.contact.tel,
        provider_address_street: data.address.street,
        provider_address_number: `${data.address.number}`,
        provider_address_complement: data.address.complement || '',
        provider_address_city: { label: data.address.city, value: data.address.city },
        provider_address_state: {
          label: (res && res.data?.nome) || '',
          value: data.address?.state || ''
        },
        provider_address_postal_code: data.address.postalCode
      };

      setProviderInfo(values);
      setLoading(false);
    });
  }, []);

  const handleTabChange = useCallback((event, value) => {
    setTabValue(value);
  }, []);

  const handleOnSubmit = useCallback(async (values: IProviderEditForm, actions) => {
    const providerPaylod = {
      fullName: values.provider_full_name,
      doc: {
        id: values.provider_doc_id,
        type: values.provider_doc_type
      },
      contact: {
        email: values.provider_contact_email,
        tel: values.provider_contact_tel
      },
      address: {
        street: values.provider_address_street,
        number: values.provider_address_number,
        complement: values.provider_address_complement,
        city: values.provider_address_city.value,
        postalCode: values.provider_address_postal_code,
        state: values.provider_address_state.value
      }
    };

    try {
      await api.put(`/provider/${id}`, providerPaylod);

      actions.setSubmitting(false);
      toast.success('Fornecedor atualizado com sucesso!');
      history.push('/provider');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na atualização do fornecedor: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na atualização do fornecedor`);
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
            <Tab label='Dados cadastrais' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <Formik initialValues={providerInfo} validationSchema={ProviderFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IProviderEditForm>) => (
            <Form>
              <div className={classes.formContainer}>
                <TabPanel value={tabValue} index={0}>
                  <PersonalInfo />
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
