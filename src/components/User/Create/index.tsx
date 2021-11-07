import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import clsx from 'clsx';
import UserFormSchema from './validations';
import { INITIAL_FORM_VALUES } from '../../../constants/user';
import { IUserRegisterForm, IUser } from '../../../interfaces/IUser';
import api from '../../../services/api';
import useStyles from './styles';
import UserInfo from '../Forms/UserInfoCreate';
import PersonalInfo from '../Forms/PersonalInfo';
import SellerInfo from '../Forms/SellerInfo/index';
import { useHeaderTitle } from '../../../contexts/headerTitle';

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

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Cadastro de usuário');
  }, []);

  const history = useHistory();

  const handleTabChange = useCallback((event, value) => {
    setTabValue(value);
  }, []);

  const handleOnSubmit = useCallback(async (values: IUserRegisterForm, actions) => {
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

    try {
      const response = await api.post('/user', userPaylod);

      const { data: user }: { data: IUser } = response.data;

      if (values.user_is_seller) {
        const sellerPayload = {
          comission: (values.user_seller_comission || 0) / 100,
          maxDiscount: (values.user_seller_max_discount || 0) / 100,
          user: user._id
        };

        await api.post('/seller', sellerPayload);
      }

      actions.setSubmitting(false);
      toast.success('Usuário criado com sucesso!');
      history.push('/user');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na criação do usuário: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na criação do usuário`);
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
            <Tab label='Usuário' />
            <Tab label='Dados pessoais' />
            <Tab label='Vendas' />
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
                <TabPanel value={tabValue} index={2}>
                  <SellerInfo />
                </TabPanel>
              </div>

              <div className={classes.footerButtons}>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => setTabValue(tabValue - 1)}
                  className={clsx(classes.Button, { [classes.hide]: tabValue === 0 })}
                >
                  Anterior
                </Button>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => setTabValue(tabValue + 1)}
                  className={clsx(classes.Button, { [classes.hide]: tabValue === 2 })}
                >
                  Próximo
                </Button>
                <Button
                  className={classes.Button}
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
