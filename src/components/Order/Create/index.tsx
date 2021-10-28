import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import axios from 'axios';
import OrderFormSchema from './validations';
import useStyles from './styles';
import { INITIAL_FORM_VALUES } from '../../../constants/order';
import { IOrderEditForm } from '../../../interfaces/IOrder';
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

function Register() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  const history = useHistory();

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
      discountPercentage: values.order_value_discount / 100,
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
        <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={OrderFormSchema} onSubmit={handleOnSubmit}>
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

export default Register;
