import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import AddIcon from '@material-ui/icons/Add';
import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { AxiosRequestConfig } from 'axios';
import { IOrderEditForm } from '../../../../interfaces/IOrder';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import ProductList from './ProductList';
import api from '../../../../services/api';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import { IProduct } from '../../../../interfaces/IProduct';
import { IOption } from '../../../../interfaces/IForm';

const useStyles = makeStyles(theme => ({
  block: {
    marginBottom: 30
  },
  productError: {
    marginTop: 20,
    color: theme.palette.error.main
  }
}));

function Products() {
  const classes = useStyles();

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IOrderEditForm>();

  useEffect(() => {
    const totalItemsValue = values.order_items.reduce((acc, item) => acc + item.product.value * item.quantity, 0);
    setFieldValue('order_value_total_items', totalItemsValue);
  }, [values.order_items]);

  const removeItem = (index: number) => () => {
    const items = [...values.order_items];

    items.splice(index, 1);

    setFieldValue('order_items', items);
  };

  const getProducts = useCallback(async (config: AxiosRequestConfig) => {
    const response = await api.get('/product', config);
    const { data } = response.data;

    return data.map((product: IProduct) => ({
      label: product.title,
      value: product._id,
      searchByLabel: `${product.title} ${product.sku}`
    }));
  }, []);

  const getProduct = useCallback(async (id: string) => {
    const response = await api.get(`/product/${id}`);
    const { data } = response.data;

    return data;
  }, []);

  const handleProductChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('order_insert_product', true);
    setFieldValue('order_insert_product', value);
  }, []);

  const handleQuantityChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('order_insert_product_quantity', true);
    setFieldValue('order_insert_product_quantity', event.target.value);
  }, []);

  const handleSearchClick = async () => {
    const insertedProduct = values.order_insert_product;

    const productData = await getProduct(insertedProduct.value);

    const items = [...values.order_items];

    const findIndexItem = items.findIndex(item => item.product._id === insertedProduct.value);

    if (findIndexItem !== -1) {
      items[findIndexItem].quantity =
        Number(items[findIndexItem].quantity) + Number(values.order_insert_product_quantity) || 0;
    } else {
      items.push({
        quantity: values.order_insert_product_quantity || 0,
        product: productData,
        value: {
          unitary: productData.value,
          subtotal: productData.value * (values.order_insert_product_quantity || 0)
        }
      });
    }

    setFieldTouched('order_items', true);
    setFieldValue('order_items', items);
    setFieldValue('order_insert_product', { label: '', value: '' });
    setFieldValue('order_insert_product_quantity', '');
  };

  return (
    <div>
      <div className={classes.block}>
        <h2>Inserir Produto</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={3}>
            <Field
              name='order_insert_product'
              textFieldProps={{
                label: 'Produto',
                placeholder: 'SKU ou Nome',
                error: touched.order_insert_product && !!errors.order_insert_product,
                helperText: touched.order_insert_product && errors.order_insert_product
              }}
              getOptions={getProducts}
              noOptionsText='Produto não cadastrado'
              component={SingleSelectFormField}
              onChange={handleProductChange}
              value={values.order_insert_product}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              name='order_insert_product_quantity'
              label='Quantidade'
              type='number'
              error={touched.order_insert_product_quantity && !!errors.order_insert_product_quantity}
              helperText={touched.order_insert_product_quantity && errors.order_insert_product_quantity}
              component={TextFormField}
              onChange={handleQuantityChange}
              value={values.order_insert_product_quantity}
              fullWidth
            />
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              disabled={!values.order_insert_product_quantity || !values.order_insert_product.value}
              variant='contained'
              color='secondary'
              startIcon={<AddIcon fontSize='small' />}
              onClick={handleSearchClick}
            >
              Inserir
            </Button>
          </Grid>
        </Grid>
      </div>
      {touched.order_items && !!errors.order_items ? (
        <Typography className={classes.productError}>{errors.order_items}</Typography>
      ) : null}
      <div className={classes.block}>
        {values.order_items?.length !== 0 ? <ProductList removeItem={removeItem} items={values.order_items} /> : null}
      </div>
    </div>
  );
}

export default Products;
