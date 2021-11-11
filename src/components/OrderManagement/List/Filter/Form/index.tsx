import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { useStyles } from './styles';
import { IOption } from '../../../../../interfaces/IForm';
import SingleSelectFormField from '../../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../../Shared/FormFields/TextFormField';
import api from '../../../../../services/api';
import { ISeller } from '../../../../../interfaces/ISeller';
import { IOrderRequestFilter } from '../../../../../interfaces/IOrder';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/orderRequest';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, resetForm, isValid, isSubmitting, setFieldTouched } =
    useFormikContext<IOrderRequestFilter>();

  const statusOptions = [
    { label: 'Pendente', value: 'pending' },
    { label: 'Aprovado', value: 'approved' },
    { label: 'Reprovado', value: 'reproved' }
  ];

  const getSellers = useCallback(async () => {
    const request = await api.get('/seller', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((seller: ISeller) => ({ label: seller.user.fullName, value: seller._id }));
  }, []);

  const handleCodChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('request_order_cod', true);
    setFieldValue('request_order_cod', event.target.value);
  };

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('request_status', true);
    setFieldValue('request_status', value);
  };

  const handleSellerChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('request_order_seller', true);
    setFieldValue('request_order_seller', value);
  };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={12} md={3}>
          <Field
            type='number'
            id='request_order_cod'
            name='request_order_cod'
            InputLabelProps={{
              shrink: true
            }}
            label='Código do Pedido'
            component={TextFormField}
            onChange={handleCodChange}
            value={values.request_order_cod}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field
            id='request_order_seller'
            name='request_order_seller'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Vendedor'
            }}
            getOptions={getSellers}
            component={SingleSelectFormField}
            onChange={handleSellerChange}
            value={values.request_order_seller}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Field
            id='request_status'
            name='request_status'
            fullWidth
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Status'
            }}
            options={statusOptions}
            component={SingleSelectFormField}
            onChange={handleStatusChange}
            value={values.request_status}
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
