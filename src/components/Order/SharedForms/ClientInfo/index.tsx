import React, { ChangeEvent, useCallback, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Button, Grid, Paper, Typography, makeStyles, IconButton } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import { AxiosRequestConfig } from 'axios';
import { Link, useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IOrderEditForm } from '../../../../interfaces/IOrder';
import { IOption } from '../../../../interfaces/IForm';
import api from '../../../../services/api';
import Info from './Info';

const useStyles = makeStyles(theme => ({
  block: {
    marginBottom: 30
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.primary.main
  },
  customerError: {
    marginTop: 20,
    color: theme.palette.error.main
  }
}));

function ClientInfo() {
  const classes = useStyles();
  const [showCreateMessage, setShowCreateMessage] = useState(false);

  const history = useHistory();

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IOrderEditForm>();

  const searchCustomerTypes = [
    {
      label: 'CPF',
      value: 'customer_doc_f'
    },
    {
      label: 'CNPJ',
      value: 'customer_doc_j'
    }
  ];

  const getCustomer = useCallback(async (config: AxiosRequestConfig) => {
    const { data: response } = await api.get('/customer', config);
    const [customerData] = response.data;

    return customerData;
  }, []);

  const handleSearchTypeChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('order_search_customer_type', true);
    setFieldValue('order_search_customer_type', value);
    setFieldValue('order_search_customer_value', '');
  }, []);

  const handleSearchValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');

      const { value } = event.target;

      setFieldTouched('order_search_customer_value', true);

      if (['customer_doc_f', 'customer_doc_j'].includes(`${values.order_search_customer_type.value}`)) {
        setFieldValue('order_search_customer_value', onlyNumbers(value));
      } else {
        setFieldValue('order_search_customer_value', value);
      }
    },
    [values.order_search_customer_type.value]
  );

  const handleSearchClick = async () => {
    const customerData = await getCustomer({ params: { doc: values.order_search_customer_value } });

    setFieldTouched('order_customer_id', true);
    if (customerData) {
      setFieldValue('order_customer', customerData);
      setFieldValue('order_customer_id', customerData._id);
      setShowCreateMessage(false);
    } else {
      setFieldValue('order_customer', null);
      setFieldValue('order_customer_id', '');
      setShowCreateMessage(true);
    }
  };

  return (
    <div>
      <div className={classes.block}>
        <h2>Buscar Cliente</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={3}>
            <Field
              name='order_search_customer_type'
              textFieldProps={{
                label: 'Tipo de Busca',
                InputLabelProps: {
                  shrink: true
                }
              }}
              options={searchCustomerTypes}
              disableClearable
              component={SingleSelectFormField}
              onChange={handleSearchTypeChange}
              value={values.order_search_customer_type}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              name='order_search_customer_value'
              label={values.order_search_customer_type.label}
              InputLabelProps={{
                shrink: true
              }}
              error={touched.order_search_customer_value && !!errors.order_search_customer_value}
              helperText={touched.order_search_customer_value && errors.order_search_customer_value}
              component={TextFormField}
              mask={
                values.order_search_customer_type.value === 'customer_doc_f' ? '999.999.999-99' : '99.999.999/9999-99'
              }
              onChange={handleSearchValueChange}
              value={values.order_search_customer_value}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
            {showCreateMessage ? (
              <Typography>
                Cliente não cadastrado.{' '}
                <Link to='/customer/register' className={classes.link}>
                  Clique aqui
                </Link>{' '}
                para cadastrar
              </Typography>
            ) : null}
          </Grid>
          <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<SearchIcon fontSize='small' />}
              onClick={handleSearchClick}
            >
              Pesquisar
            </Button>
          </Grid>
        </Grid>
        {touched.order_customer_id && !!errors.order_customer_id ? (
          <Typography className={classes.customerError}>{errors.order_customer_id}</Typography>
        ) : null}
      </div>
      <div className={classes.block}>
        {values.order_customer ? (
          <div>
            <div style={{ display: 'flex' }}>
              <h2 style={{ flex: 1 }}>Dados do cliente</h2>
              <IconButton onClick={() => history.push(`/customer/${values.order_customer?._id}/edit`)}>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  setFieldValue('order_customer', null);
                  setFieldValue('order_customer_id', '');
                }}
              >
                <ClearIcon />
              </IconButton>
            </div>
            <Info customer={values.order_customer} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ClientInfo;
