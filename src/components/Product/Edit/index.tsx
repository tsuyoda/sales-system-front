import { Box, Button, IconButton, Tab, Tabs } from '@material-ui/core';
import { Formik, FormikProps, Form } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory, useParams } from 'react-router-dom';
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

function Edit() {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [productInfo, setProductInfo] = useState<IProductEditForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const measurementUnitTypes: { [key: string]: string } = {
    'kg': 'Quilograma',
    'w': 'Watt',
    'a': 'Ampere',
    'v': 'Volts',
    'l': 'Litro',
    'm': 'Metro',
    'm³': 'Metro Cúbico',
    'm²': 'Metro Quadrado',
    'hz': 'Hertz'
  };

  useEffect(() => {
    api.get(`/product/${id}`).then(async response => {
      const { data } = response.data;

      const values: IProductEditForm = {
        product_sku: data.sku,
        product_title: data.title,
        product_description: data.description || '',
        product_value: data.value,
        product_provider: { label: data.provider.fullName, value: data.provider._id },
        product_quantity: data.quantity,
        product_measurement_unit_type: {
          label: measurementUnitTypes[data.measurementUnit.type],
          value: data.measurementUnit.type
        },
        product_measurement_unit_value: data.measurementUnit.value,
        product_length: data.length,
        product_width: data.width,
        product_height: data.height,
        product_weight: data.weight
      };

      setProductInfo(values);
      setLoading(false);
    });
  }, []);

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
      await api.put(`/product/${id}`, productPayload);

      actions.setSubmitting(false);
      toast.success('Produto atualizado com sucesso!');
      history.push('/product');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha na atualização do produto: ${err.response?.data.error}`);
        actions.setSubmitting(false);
      } else {
        toast.error(`Falha na atualização do produto`);
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
            <Tab label='Descrição do Produto' />
            <Tab label='Especificações' />
          </Tabs>
        </Box>
      </div>
      <div className={classes.content}>
        <Formik initialValues={productInfo} validationSchema={ProductFormSchema} onSubmit={handleOnSubmit}>
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

export default Edit;
