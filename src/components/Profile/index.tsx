import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import React, { useCallback, useState, useEffect } from 'react';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import useStyles from './styles';
import UserInfo from './Forms/UserInfo';
import PersonalInfo from './Forms/PersonalInfo';
import SellerInfo from './Forms/SellerInfo/index';
import api from '../../services/api';
import { IProfileForm } from '../../interfaces/IProfile';
import { IUser } from '../../interfaces/IUser';
import { useHeaderTitle } from '../../contexts/headerTitle';

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

function Profile() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [values, setValues] = useState<IProfileForm>({} as IProfileForm);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Meu perfil');
  }, []);

  useEffect(() => {
    api.get(`/profile`).then(async response => {
      const { data: profile }: { data: IUser } = response.data;

      const res = profile.address?.state
        ? await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${profile.address.state}`)
        : null;

      const responseSeller = await api.get('/seller', { params: { user: profile._id } });

      const [seller] = responseSeller.data.data;

      const profileValues: IProfileForm = {
        profile_full_name: profile.fullName || '',
        profile_email: profile.email || '',
        profile_name: profile.name || '',
        profile_doc_id: profile.doc?.id || '',
        profile_doc_type: profile.doc?.type || 'F',
        profile_contact_email: profile.contact?.email || '',
        profile_contact_tel: profile.contact?.tel || '',
        profile_address_street: profile.address?.street || '',
        profile_address_number: `${profile.address?.number}` || '',
        profile_address_complement: profile.address?.complement || '',
        profile_address_city: {
          label: profile.address?.city || '',
          value: profile.address?.city || ''
        },
        profile_address_postal_code: profile.address?.postalCode || '',
        profile_address_state: {
          label: (res && res.data?.nome) || '',
          value: profile.address?.state || ''
        },
        profile_role: {
          label: profile.role?.name || '',
          // eslint-disable-next-line no-underscore-dangle
          value: profile.role?._id || ''
        },
        profile_is_seller: !!seller,
        profile_seller_comission: seller ? seller.comission * 100 : 0,
        profile_seller_max_discount: seller ? seller.maxDiscount * 100 : 0
      };

      setValues(profileValues);
      setLoading(false);
    });
  }, []);

  const handleTabChange = useCallback((event, value) => {
    setTabValue(value);
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
            <Tab label='Vendas' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <div className={classes.formContainer}>
          <TabPanel value={tabValue} index={0}>
            <UserInfo values={values} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PersonalInfo values={values} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <SellerInfo values={values} />
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
        </div>
      </div>
    </>
  );
}

export default Profile;
