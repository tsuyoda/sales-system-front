import { Box, Button, IconButton, Tab, Tabs, Typography } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import UpdateIcon from '@material-ui/icons/Update';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
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

interface RouteParams {
  id: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function Edit() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [userInfo, setUserInfo] = useState<IUserRegisterForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<RouteParams>();

  const history = useHistory();

  const handleTabChange = useCallback((event, value) => {
    setTabValue(value);
  }, []);

  useEffect(() => {
    api.get(`/user/${id}`).then(async response => {
      const { data } = response.data;

      const res = data.address?.state
        ? await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.address.state}`)
        : null;

      const values: IUserRegisterForm = {
        user_full_name: data.fullName || '',
        user_email: data.email || '',
        user_name: data.name || '',
        user_doc_id: data.doc?.id || '',
        user_doc_type: data.doc?.type || 'F',
        user_contact_email: data.contact?.email || '',
        user_contact_tel: data.contact?.tel || '',
        user_address_street: data.address?.street || '',
        user_address_number: data.address?.number || '',
        user_address_complement: data.address?.complement || '',
        user_address_city: {
          label: data.address?.city || '',
          value: data.address?.city || ''
        },
        user_address_postal_code: data.address?.postalCode || '',
        user_address_state: {
          label: (res && res.data?.nome) || '',
          value: data.address?.state || ''
        },
        user_role: {
          label: data.role?.name || '',
          // eslint-disable-next-line no-underscore-dangle
          value: data.role?._id || ''
        }
      };

      setUserInfo(values);
      setLoading(false);
    });
  }, []);

  const handleOnSubmit = useCallback((values: IUserRegisterForm, actions) => {
    const userPaylod = {
      fullName: values.user_full_name,
      email: values.user_email,
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
      .put(`/user/${id}`, userPaylod)
      .then(() => {
        toast.success('Usuário atualizado com sucesso!');
        history.push('/user');
      })
      .catch(err => {
        if (err.response) {
          toast.error(`Falha na atualização do usuário: ${err.response.data.error}`);
        } else {
          toast.error(`Falha na atualização do usuário. Tente novamente mais tarde.`);
        }
      });

    actions.setSubmitting(false);
  }, []);

  return loading ? null : (
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
        <Formik initialValues={userInfo} validationSchema={UserFormSchema} onSubmit={handleOnSubmit}>
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
                  startIcon={<UpdateIcon />}
                >
                  Atualizar
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
