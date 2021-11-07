import { Button, IconButton } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import OrderFormSchema from './validations';
import useStyles from './styles';
import { INITIAL_FORM_VALUES } from '../../../constants/order';
import { IOrderEditForm, IOrderItem } from '../../../interfaces/IOrder';
import ClientInfo from '../Forms/ClientInfo/index';
import Products from '../Forms/Products';
import DeliveryInfo from '../Forms/DeliveryInfo/index';
import Payment from '../Forms/Payment';
import SellerInfo from '../Forms/SellerInfo';
import api from '../../../services/api';
import { useHeaderTitle } from '../../../contexts/headerTitle';
import PointsProgram from '../Forms/PointsProgram';

function Edit() {
  const classes = useStyles();
  const [orderInfo, setOrderInfo] = useState<IOrderEditForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Edição de pedido');
  }, []);

  const paymentTypes: { [key: string]: string } = {
    credit_card: 'Cartão de Crédito',
    bankslip: 'Boleto Bancário',
    pix: 'Pix'
  };

  useEffect(() => {
    (async () => {
      const orderResponse = await api.get(`/order/${id}`);
      const { data: order } = orderResponse.data;

      const customerResponse = await api.get(`/customer/${order.customer._id}`);
      const { data: customer } = customerResponse.data;

      const { data: scoreResponse } = await api.get('/score', { params: { customer: customer._id } });
      const [score] = scoreResponse.data;

      const sellerResponse = await api.get(`/seller/${order.seller._id}`);
      const { data: seller } = sellerResponse.data;

      const itemsPromises: Promise<IOrderItem>[] = order.items.map(async (item: IOrderItem) => {
        const productResponse = await api.get(`/product/${item.product}`);
        const { data: product } = productResponse.data;

        return {
          quantity: item.quantity,
          product
        };
      });

      const items = await Promise.all(itemsPromises);

      const values: IOrderEditForm = {
        order_search_customer_type: { label: 'CPF', value: 'customer_doc_f' },
        order_search_customer_value: '',
        order_customer_score: score,
        order_customer: customer,
        order_customer_id: customer._id,
        order_seller: { label: seller.user.name, value: seller._id },
        order_insert_product: { label: '', value: '' },
        order_items: items,
        order_delivery_date: new Date(order.date.delivery),
        order_payment_date: new Date(order.date.payment),
        order_comments: '',
        order_value_total_items: order.value.totalItems,
        order_value_delivery: order.value.delivery,
        order_seller_discount: order.discountPercentage * 100 || 0,
        order_value_discount: order.value.totalDiscount,
        order_discount_field: order.discountPercentage * 100 || 0,
        order_value_total: order.value.total,
        order_payment_method: { label: paymentTypes[order.paymentType], value: order.paymentType }
      };

      setOrderInfo(values);
      setLoading(false);
    })();
  }, []);

  const handleOnSubmit = useCallback(async (values: IOrderEditForm, actions) => {
    const orderPayload = {
      status: 'Processado',
      seller: values.order_seller.value,
      customer: values.order_customer_id,
      value: {
        totalItems: values.order_value_total_items,
        totalDiscount: (values.order_value_total_items * values.order_value_discount) / 100,
        total: values.order_value_total
      },
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
      await api.put('/order', orderPayload);

      actions.setSubmitting(false);
      toast.success('Pedido atualizado com sucesso!');
      history.push('/order');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na atualização do pedido: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na atualização do pedido`);
        actions.setSubmitting(false);
      }
    }
  }, []);

  return loading ? null : (
    <>
      <div className={classes.tabs}>
        <IconButton onClick={() => history.goBack()}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </div>
      <div className={classes.content}>
        <Formik initialValues={orderInfo} validationSchema={OrderFormSchema} onSubmit={handleOnSubmit}>
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

export default Edit;
