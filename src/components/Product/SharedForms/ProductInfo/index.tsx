import { Grid, makeStyles, Paper } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import CurrencyTextField from '@unicef/material-ui-currency-textfield';
import { IProductEditForm } from '../../../../interfaces/IProduct';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import api from '../../../../services/api';
import { IProvider } from '../../../../interfaces/IProvider';
import { IOption } from '../../../../interfaces/IForm';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  }
});

function ProductInfo() {
  const classes = useStyles();

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IProductEditForm>();

  const getProviders = useCallback(async () => {
    const request = await api.get('/provider', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((provider: IProvider) => ({ label: provider.fullName, value: provider._id }));
  }, []);

  const handleTextChange = (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, event.target.value);
  };

  const handleProviderChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('product_provider', true);
    setFieldValue('product_provider', value);
  };

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>, value: number) => {
    setFieldTouched('product_value', true);
    setFieldValue('product_value', value);
  };

  return (
    <div>
      <div className={classes.block}>
        <h2>Informações Básicas</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4}>
            <Field
              variant='outlined'
              name='product_title'
              label='Título'
              component={TextFormField}
              value={values.product_title}
              onChange={handleTextChange('product_title')}
              error={touched.product_title && !!errors.product_title}
              helperText={touched.product_title && errors.product_title}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              variant='outlined'
              name='product_sku'
              label='SKU'
              component={TextFormField}
              value={values.product_sku}
              onChange={handleTextChange('product_sku')}
              error={touched.product_sku && !!errors.product_sku}
              helperText={touched.product_sku && errors.product_sku}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              textFieldProps={{
                variant: 'outlined',
                label: 'Fornecedor',
                error: touched.product_provider && (!!errors.product_provider?.value || !!errors.product_provider),
                helperText: touched.product_provider && (errors.product_provider?.value || errors.product_provider)
              }}
              name='product_provider'
              getOptions={getProviders}
              component={SingleSelectFormField}
              value={values.product_provider}
              onChange={handleProviderChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name='product_description'
              label='Descrição'
              variant='outlined'
              multiline
              rows={3}
              rowsMax={4}
              component={TextFormField}
              value={values.product_description}
              onChange={handleTextChange('product_description')}
              error={touched.product_description && !!errors.product_description}
              helperText={touched.product_description && errors.product_description}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              name='product_value'
              label='Valor'
              variant='outlined'
              currencySymbol='R$'
              decimalCharacter=','
              digitGroupSeparator='.'
              component={CurrencyTextField}
              onChange={handleValueChange}
              value={values.product_value}
              error={touched.product_value && !!errors.product_value}
              helperText={touched.product_value && errors.product_value}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              name='product_quantity'
              type='number'
              label='Quantidade'
              variant='outlined'
              component={TextFormField}
              value={values.product_quantity}
              onChange={handleTextChange('product_quantity')}
              error={touched.product_quantity && !!errors.product_quantity}
              helperText={touched.product_quantity && errors.product_quantity}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ProductInfo;
