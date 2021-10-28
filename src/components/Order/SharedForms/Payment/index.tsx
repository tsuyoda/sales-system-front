import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { Button, Grid, makeStyles, Paper } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent } from '@fortawesome/free-solid-svg-icons';
import { Field, useFormikContext } from 'formik';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Card from '../../../Shared/Card';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IOrderEditForm } from '../../../../interfaces/IOrder';
import { IOption } from '../../../../interfaces/IForm';

const useStyles = makeStyles({
  block: {
    marginBottom: 50
  },
  card: {
    margin: '0 5px 0 5px'
  },
  percentIcon: {
    marginLeft: 10
  }
});

function Payment() {
  const classes = useStyles();

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IOrderEditForm>();

  useEffect(() => {
    const { order_value_total_items, order_value_discount } = values;

    const total = order_value_total_items - (order_value_total_items * order_value_discount) / 100;

    setFieldValue('order_value_total', total);
  }, [values.order_value_total_items, values.order_value_discount]);

  const paymentTypes = [
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'bankslip', label: 'Boleto Bancário' },
    { value: 'pix', label: 'Pix' }
  ];

  const handleInsertDiscountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('order_insert_discount', Number(event.target.value));
  };

  const handleInsertDiscountClick = () => {
    setFieldValue('order_value_discount', values.order_insert_discount);
  };

  const handleDateChange = (date: Date | null) => {
    setFieldTouched('order_payment_date', true);
    setFieldValue('order_payment_date', date);
  };

  const handlePaymentChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('order_payment_method', true);
    setFieldValue('order_payment_method', value);
  }, []);

  return (
    <div>
      <div className={classes.block}>
        <h2>Pagamento</h2>
        <div style={{ display: 'flex' }}>
          <Card
            icon={<CalendarTodayIcon fontSize='large' />}
            title='Hoje'
            subTitle='Criação'
            className={classes.card}
          />
          <Card
            icon={<AllInboxIcon fontSize='large' />}
            title={`R$ ${values.order_value_total_items.toFixed(2)}`.replace('.', ',')}
            subTitle='Total em Itens'
            className={classes.card}
          />
          <Card
            icon={<MonetizationOnIcon fontSize='large' />}
            title={`R$ ${((values.order_value_total_items * values.order_value_discount) / 100).toFixed(2)}`.replace(
              '.',
              ','
            )}
            subTitle='Desconto Aplicado'
            className={classes.card}
          />
          <Card
            icon={<AttachMoneyIcon fontSize='large' />}
            title={`R$ ${values.order_value_total.toFixed(2)}`.replace('.', ',')}
            subTitle='Total'
            className={classes.card}
          />
        </div>
      </div>
      <div className={classes.block}>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={8}>
            <Field
              textFieldProps={{
                variant: 'outlined',
                label: 'Forma de Pagamento',
                error:
                  touched.order_payment_method &&
                  (!!errors.order_payment_method?.value || !!errors.order_payment_method),
                helperText:
                  touched.order_payment_method && (errors.order_payment_method?.value || errors.order_payment_method)
              }}
              value={values.order_payment_method}
              onChange={handlePaymentChange}
              component={SingleSelectFormField}
              options={paymentTypes}
            />
          </Grid>
          <Grid item xs={4}>
            <KeyboardDatePicker
              invalidDateMessage='Data inválida'
              disableToolbar
              variant='inline'
              inputVariant='outlined'
              format='dd/MM/yyyy'
              label='Data de Pagamento'
              value={values.order_payment_date}
              onChange={handleDateChange}
              error={touched.order_payment_date && !!errors.order_payment_date}
              helperText={touched.order_payment_date && errors.order_payment_date}
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              variant='outlined'
              id='order_insert_discount'
              name='order_insert_discount'
              label='Desconto'
              type='number'
              value={values.order_insert_discount}
              onChange={handleInsertDiscountChange}
              component={TextFormField}
              InputProps={{
                endAdornment: <FontAwesomeIcon icon={faPercent} className={classes.percentIcon} />
              }}
            />
          </Grid>
          <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant='contained' color='primary' onClick={handleInsertDiscountClick}>
              Aplicar
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Payment;
