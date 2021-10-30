import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ProviderFormSchema from './validations';
import api from '../../../services/api';
import useStyles from './styles';
import PersonalInfo from '../Forms/PersonalInfo';
import { IProviderEditForm } from '../../../interfaces/IProvider';
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

  const history = useHistory();

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
      await api.post('/provider', providerPaylod);

      actions.setSubmitting(false);
      toast.success('Fornecedor criado com sucesso!');
      history.push('/provider');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na criação do fornecedor: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na criação do fornecedor`);
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
            <Tab label='Dados cadastrais' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={ProviderFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IProviderEditForm>) => (
            <Form>
              <div className={classes.formContainer}>
                <TabPanel value={tabValue} index={0}>
                  <PersonalInfo />
                </TabPanel>
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
