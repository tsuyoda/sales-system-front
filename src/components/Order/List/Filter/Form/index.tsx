import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { useStyles } from './styles';
import { IOption } from '../../../../../interfaces/IForm';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/order';
import SingleSelectFormField from '../../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../../Shared/FormFields/TextFormField';
import { IOrderFilter } from '../../../../../interfaces/IOrder';
import api from '../../../../../services/api';
import { ICustomer } from '../../../../../interfaces/ICustomer';
import { ISeller } from '../../../../../interfaces/ISeller';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, resetForm, isValid, isSubmitting, setFieldTouched } = useFormikContext<IOrderFilter>();

  const getCustomers = useCallback(async () => {
    const request = await api.get('/customer', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((customer: ICustomer) => ({ label: customer.fullName, value: customer._id }));
  }, []);

  const getSellers = useCallback(async () => {
    const request = await api.get('/seller', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((seller: ISeller) => ({ label: seller.user.fullName, value: seller._id }));
  }, []);

  const handleCodChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('order_cod', true);
    setFieldValue('order_cod', event.target.value);
  };

  const handleCustomerChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('order_customer', true);
    setFieldValue('order_customer', value);
  };

  const handleSellerChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('order_seller', true);
    setFieldValue('order_seller', value);
  };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={12} md={3}>
          <Field
            type='number'
            id='order_cod'
            name='order_cod'
            InputLabelProps={{
              shrink: true
            }}
            label='Código do Pedido'
            component={TextFormField}
            onChange={handleCodChange}
            value={values.order_cod}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Field
            id='order_customer'
            name='order_customer'
            fullWidth
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Cliente'
            }}
            getOptions={getCustomers}
            component={SingleSelectFormField}
            onChange={handleCustomerChange}
            value={values.order_customer}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field
            id='order_seller'
            name='order_seller'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Vendedor'
            }}
            getOptions={getSellers}
            component={SingleSelectFormField}
            onChange={handleSellerChange}
            value={values.order_seller}
          />
        </Grid>
        <Grid item xs={6} md={1}>
          <Button fullWidth className={classes.filterButton} onClick={handleClearClick}>
            LIMPAR
          </Button>
        </Grid>
        <Grid item xs={6} md={1}>
          <Button
            color='secondary'
            disabled={!isValid || isSubmitting}
            variant='contained'
            fullWidth
            className={classes.filterButton}
            type='submit'
          >
            <FilterListIcon fontSize='small' />
          </Button>
        </Grid>
      </Grid>
    </FormFormik>
  );
}

export default Form;
