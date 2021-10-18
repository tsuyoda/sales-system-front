import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import UserFormSchema from './validations';
import { INITIAL_FORM_VALUES } from '../../../constants/user';
import { IUserRegisterForm } from '../../../interfaces/IUser';
import api from '../../../services/api';
import useStyles from './styles';
import UserInfo from './UserInfo';
import PersonalInfo from '../SharedForms/PersonalInfo';

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

  const handleOnSubmit = useCallback((values: IUserRegisterForm, actions) => {
    const userPaylod = {
      fullName: values.user_full_name,
      email: values.user_email,
      password: values.user_password,
      name: values.user_name,
      doc: {
        id: values.user_doc_id,
        type: values.user_doc_type
      },
      contact: {
        email: values.user_contact_email,
        tel: values.user_contact_tel
      },
      address: {
        street: values.user_address_street,
        number: values.user_address_number,
        complement: values.user_address_complement,
        city: values.user_address_city.value,
        postalCode: values.user_address_postal_code,
        state: values.user_address_state.value
      },
      role: values.user_role.value
    };

    api
      .post('/user', userPaylod)
      .then(() => {
        toast.success('Usuário criado com sucesso!');
        history.push('/user');
      })
      .catch(err => {
        if (err.response) {
          toast.error(`Falha na criação do usuário: ${err.response.data.error}`);
        }
      });

    actions.setSubmitting(false);
  }, []);

  return (
    <>
      <div className={classes.tabs}>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label='Usuário' />
            <Tab label='Dados pessoais' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={UserFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IUserRegisterForm>) => (
            <Form>
              <div className={classes.formContainer}>
                <TabPanel value={tabValue} index={0}>
                  <UserInfo />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
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
