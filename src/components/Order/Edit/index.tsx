import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import OrderFormSchema from './validations';
import useStyles from './styles';
import { INITIAL_FORM_VALUES } from '../../../constants/order';
import { IOrderEditForm, IOrderItem } from '../../../interfaces/IOrder';
import ClientInfo from '../SharedForms/ClientInfo/index';
import Products from '../SharedForms/Products';
import DeliveryInfo from '../SharedForms/DeliveryInfo/index';
import Payment from '../SharedForms/Payment';
import SellerInfo from '../SharedForms/SellerInfo';
import api from '../../../services/api';

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

function Edit() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [orderInfo, setOrderInfo] = useState<IOrderEditForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();

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
        order_customer: customer,
        order_customer_id: customer._id,
        order_seller: { label: seller.user.name, value: seller._id },
        order_insert_product: { label: '', value: '' },
        order_items: items,
        order_delivery_date: new Date(order.date.delivery),
        order_payment_date: new Date(order.date.payment),
        order_comments: '',
        order_value_total_items: order.value.totalItems,
        order_value_discount: order.discountPercentage * 100 || 0,
        order_insert_discount: order.discountPercentage * 100,
        order_value_total: order.value.total,
        order_payment_method: { label: paymentTypes[order.paymentType], value: order.paymentType }
      };

      setOrderInfo(values);
      setLoading(false);
    })();
  }, []);

  const handleTabChange = useCallback((event, value) => {
    setTabValue(value);
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label='Dados do cliente' />
            <Tab label='Vendedor' />
            <Tab label='Produtos' />
            <Tab label='Entrega' />
            <Tab label='Pagamento' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <Formik initialValues={orderInfo} validationSchema={OrderFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IOrderEditForm>) => {
            return (
              <Form>
                <div className={classes.formContainer}>
                  <TabPanel value={tabValue} index={0}>
                    <ClientInfo />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <SellerInfo />
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <Products />
                  </TabPanel>
                  <TabPanel value={tabValue} index={3}>
                    <DeliveryInfo />
                  </TabPanel>
                  <TabPanel value={tabValue} index={4}>
                    <Payment />
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
                    className={clsx(classes.Button, { [classes.hide]: tabValue === 4 })}
                  >
                    Próximo
                  </Button>
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