import { Button, IconButton } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import OrderFormSchema from './validations';
import useStyles from './styles';
import { INITIAL_FORM_VALUES } from '../../../constants/order';
import { IOrderEditForm } from '../../../interfaces/IOrder';
import ClientInfo from '../Forms/ClientInfo/index';
import Products from '../Forms/Products';
import DeliveryInfo from '../Forms/DeliveryInfo/index';
import Payment from '../Forms/Payment';
import SellerInfo from '../Forms/SellerInfo';
import api from '../../../services/api';
import { useHeaderTitle } from '../../../contexts/headerTitle';
import PointsProgram from '../Forms/PointsProgram/index';
import { ISeller } from '../../../interfaces/ISeller';

function Register() {
  const classes = useStyles();

  const history = useHistory();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Cadastro de pedido');
  }, []);

  const handleOnSubmit = useCallback(async (values: IOrderEditForm, actions) => {
    const orderPayload = {
      seller: values.order_seller.value,
      customer: values.order_customer_id,
      value: {
        totalItems: values.order_value_total_items,
        totalDiscount: values.order_value_discount,
        delivery: values.order_value_delivery,
        total: values.order_value_total
      },
      discountPercentage: values.order_seller_discount / 100,
      paymentType: values.order_payment_method.value,
      date: {
        delivery: values.order_delivery_date.toISOString(),
        payment: values.order_payment_date.toISOString()
      },
      items: values.order_items.map(item => ({
        quantity: item.quantity,
        value: {
          unitary: item.product.value,
          subtotal: item.product.value * item.quantity
        },
        product: item.product._id
      }))
    };

    try {
      await api.post('/order', orderPayload);

      actions.setSubmitting(false);
      toast.success('Pedido criado com sucesso!');
      history.push('/order');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na criação do pedido: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na criação do pedido`);
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
      </div>
      <div className={classes.content}>
        <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={OrderFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IOrderEditForm>) => {
            return (
              <Form>
                <div className={classes.formContainer}>
                  <div className={classes.block}>
                    <ClientInfo />
                  </div>
                  <div className={classes.block}>
                    <SellerInfo />
                  </div>
                  <div className={classes.block}>
                    <Products />
                  </div>
                  <div className={classes.block}>
                    <DeliveryInfo />
                  </div>
                  <div className={classes.block}>
                    <Payment />
                  </div>
                  <div className={classes.block}>
                    <PointsProgram />
                  </div>
                </div>

                <div className={classes.footerButtons}>
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
            );
          }}
        </Formik>
      </div>
    </>
  );
}

export default Register;
