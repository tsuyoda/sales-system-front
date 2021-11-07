import React, { ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Grid, Paper } from '@material-ui/core';
import { useFormikContext } from 'formik';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IOrderEditForm } from '../../../../interfaces/IOrder';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  }
});

function DeliveryInfo() {
  const classes = useStyles();

  const { errors, touched, values, setFieldValue, setFieldTouched } = useFormikContext<IOrderEditForm>();

  const handleDateChange = (date: Date | null) => {
    setFieldTouched('order_delivery_date', true);
    setFieldValue('order_delivery_date', date);
  };

  const handleCommentsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('order_comments', true);
    setFieldValue('order_comments', event.target.value);
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>, value: number) => {
    setFieldTouched('order_value_delivery', true);
    setFieldValue('order_value_delivery', value);
  };

  return (
    <div>
      <div className={classes.block}>
        <h2>Informações de Entrega</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4}>
            <KeyboardDatePicker
              invalidDateMessage='Data inválida'
              disableToolbar
              variant='inline'
              inputVariant='outlined'
              format='dd/MM/yyyy'
              label='Data de Entrega'
              value={values.order_delivery_date}
              onChange={handleDateChange}
              error={touched.order_delivery_date && !!errors.order_delivery_date}
              helperText={touched.order_delivery_date && errors.order_delivery_date}
            />
          </Grid>
          <Grid item xs={4}>
            <CurrencyTextField
              label='Valor'
              variant='outlined'
              currencySymbol='R$'
              decimalCharacter=','
              digitGroupSeparator='.'
              onChange={handleValueChange}
              value={values.order_value_delivery}
              error={touched.order_value_delivery && !!errors.order_value_delivery}
              helperText={touched.order_value_delivery && errors.order_value_delivery}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextFormField
              variant='outlined'
              multiline
              rows={3}
              rowsMax={4}
              label='Observações'
              value={values.order_comments}
              onChange={handleCommentsChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default DeliveryInfo;
