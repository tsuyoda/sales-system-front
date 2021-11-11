import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { useStyles } from './styles';
import { IOption } from '../../../../../interfaces/IForm';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/invoice';
import SingleSelectFormField from '../../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../../Shared/FormFields/TextFormField';
import api from '../../../../../services/api';
import { ICustomer } from '../../../../../interfaces/ICustomer';
import { IInvoiceFilterForm } from '../../../../../interfaces/IInvoice';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, resetForm, isValid, isSubmitting, setFieldTouched } =
    useFormikContext<IInvoiceFilterForm>();

  const getCustomers = useCallback(async () => {
    const request = await api.get('/customer', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((customer: ICustomer) => ({ label: customer.fullName, value: customer._id }));
  }, []);

  const handleCodChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('invoice_order_cod', true);
    setFieldValue('invoice_order_cod', event.target.value);
  };

  const handleCustomerChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('invoice_customer', true);
    setFieldValue('invoice_customer', value);
  };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={12} md={4}>
          <Field
            type='number'
            id='invoice_order_cod'
            name='invoice_order_cod'
            InputLabelProps={{
              shrink: true
            }}
            label='Código do Pedido'
            component={TextFormField}
            onChange={handleCodChange}
            value={values.invoice_order_cod}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            id='invoice_customer'
            name='invoice_customer'
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
            value={values.invoice_customer}
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
