import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import ProductFormSchema from './validations';
import useStyles from './styles';
import { IProductEditForm } from '../../../interfaces/IProduct';
import { INITIAL_FORM_VALUES } from '../../../constants/product';
import ProductInfo from '../Forms/ProductInfo';
import ProductSpecifications from '../Forms/ProductSpecifications';
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

  const handleOnSubmit = useCallback(async (values: IProductEditForm, actions) => {
    const productPayload = {
      sku: values.product_sku,
      title: values.product_title,
      description: values.product_description,
      value: values.product_value,
      quantity: values.product_quantity,
      measurementUnit: {
        type: values.product_measurement_unit_type.value,
        value: values.product_measurement_unit_value
      },
      width: values.product_width,
      height: values.product_height,
      weight: values.product_weight,
      length: values.product_length,
      provider: values.product_provider.value
    };

    try {
      await api.post('/product', productPayload);

      actions.setSubmitting(false);
      toast.success('Produto criado com sucesso!');
      history.push('/product');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na criação do produto: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na criação do produto`);
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
            <Tab label='Descrição do Produto' />
            <Tab label='Especificações' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={ProductFormSchema} onSubmit={handleOnSubmit}>
          {({ isValid, isSubmitting }: FormikProps<IProductEditForm>) => (
            <Form>
              <div className={classes.formContainer}>
                <TabPanel value={tabValue} index={0}>
                  <ProductInfo />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <ProductSpecifications />
                </TabPanel>
              </div>

              <div className={classes.footerButtons}>
                {tabValue === 0 ? (
                  <Button color='primary' variant='contained' onClick={() => setTabValue(1)}>
                    Próximo
                  </Button>
                ) : (
                  <Button color='primary' variant='contained' onClick={() => setTabValue(0)}>
                    Anterior
                  </Button>
                )}
                <Button
                  className={classes.saveButton}
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
          )}
        </Formik>
      </div>
    </>
  );
}

export default Register;
