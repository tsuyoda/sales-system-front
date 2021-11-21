import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
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
import api from '../../../../services/api';

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
  const [discountWarning, setDiscountWarning] = useState(false);

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IOrderEditForm>();

  useEffect(() => {
    const {
      order_value_total_items: totalItemsValue,
      order_value_delivery: deliveryValue,
      order_seller_discount: sellerDiscount,
      order_customer: customer,
      order_customer_score: score
    } = values;

    let discountValue = (totalItemsValue * sellerDiscount) / 100;

    if (customer?.participatePointsProgram && score?.scoreLevel?.benefits) {
      score.scoreLevel.benefits.forEach(benefit => {
        if (deliveryValue && benefit.type === 'shipping_discount') {
          discountValue += deliveryValue * benefit.value;
        }
        if (totalItemsValue && benefit.type === 'purchase_discount') {
          discountValue += totalItemsValue * benefit.value;
        }
      });
    }

    setFieldValue('order_value_total', totalItemsValue + deliveryValue - discountValue);
    setFieldValue('order_value_discount', discountValue);
  }, [
    values.order_value_total_items,
    values.order_seller_discount,
    values.order_customer_score,
    values.order_value_delivery
  ]);

  useEffect(() => {
    if (values.order_seller.value && values.order_seller_discount)
      api.get(`/seller/${values.order_seller.value}`).then(response => {
        const { data: seller } = response.data;

        if (values.order_seller_discount / 100 > seller.maxDiscount) {
          setDiscountWarning(true);
        } else {
          setDiscountWarning(false);
        }
      });
    else setDiscountWarning(false);
  }, [values.order_seller.value, values.order_seller_discount]);

  const paymentTypes = [
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'bankslip', label: 'Boleto Bancário' },
    { value: 'pix', label: 'Pix' }
  ];

  const handleDiscountFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('order_discount_field', Number(event.target.value));
  };

  const handleDiscountFieldClick = () => {
    setFieldValue('order_seller_discount', values.order_discount_field);
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
            icon={<AllInboxIcon fontSize='large' />}
            title={`R$ ${values.order_value_total_items.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 3
            })}`}
            subTitle='Total em Itens'
            className={classes.card}
          />
          <Card
            icon={<LocalShippingIcon fontSize='large' />}
            title={`R$ ${values.order_value_delivery.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 3
            })}`}
            subTitle='Frete'
            className={classes.card}
          />
          <Card
            icon={<MonetizationOnIcon fontSize='large' />}
            title={`R$ ${values.order_value_discount.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 3
            })}`}
            subTitle='Desconto Aplicado'
            className={classes.card}
          />
          <Card
            icon={<AttachMoneyIcon fontSize='large' />}
            title={`R$ ${values.order_value_total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 3
            })}`}
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
              id='order_discount_field'
              name='order_discount_field'
              label='Desconto'
              type='number'
              value={values.order_discount_field}
              onChange={handleDiscountFieldChange}
              component={TextFormField}
              InputProps={{
                endAdornment: <FontAwesomeIcon icon={faPercent} className={classes.percentIcon} />
              }}
            />
          </Grid>
          <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant='contained' color='primary' onClick={handleDiscountFieldClick}>
              Aplicar
            </Button>
          </Grid>
          <Grid item xs={7} style={{ display: 'flex', alignItems: 'center' }}>
            {discountWarning ? (
              <Typography>
                Você aplicou um desconto superior ao permitido para o seu cadastro. Ao salvar, será gerado um pedido de
                aprovação para este pedido
              </Typography>
            ) : null}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Payment;
