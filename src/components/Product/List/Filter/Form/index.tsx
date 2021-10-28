import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { useStyles } from './styles';
import { IOption } from '../../../../../interfaces/IForm';
import SingleSelectFormField from '../../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../../Shared/FormFields/TextFormField';
import api from '../../../../../services/api';
import { IProductFilterForm } from '../../../../../interfaces/IProduct';
import { IProvider } from '../../../../../interfaces/IProvider';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/product';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, setErrors, resetForm, isValid, isSubmitting, touched, errors, setFieldTouched } =
    useFormikContext<IProductFilterForm>();

  const getProviders = useCallback(async () => {
    const request = await api.get('/provider', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((provider: IProvider) => ({ label: provider.fullName, value: provider._id }));
  }, []);

  const handleSearchTypeChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('product_search_type', true);
    setFieldValue('product_search_type', value);
    setFieldValue('product_search_value', '');
    setErrors({});
  };

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('product_search_value', true);
    setFieldValue('product_search_value', event.target.value);
  };

  const handleSearchProviderChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('product_search_provider', true);
    setFieldValue('product_search_provider', value);
  };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  const productSearchTypes = [
    {
      label: 'Título',
      value: 'product_title'
    },
    {
      label: 'SKU',
      value: 'product_sku'
    }
  ];

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={12} md={3}>
          <Field
            id='product_search_type'
            name='product_search_type'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Tipo de Busca'
            }}
            disableClearable
            options={productSearchTypes}
            component={SingleSelectFormField}
            onChange={handleSearchTypeChange}
            value={values.product_search_type}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Field
            id='product_search_value'
            name='product_search_value'
            label={values.product_search_type?.value === 'product_title' ? 'Título' : 'SKU'}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            error={touched.product_search_value && !!errors.product_search_value}
            helperText={touched.product_search_value && errors.product_search_value}
            component={TextFormField}
            onChange={handleSearchValueChange}
            value={values.product_search_value}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field
            id='product_search_provider'
            name='product_search_provider'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Fornecedor'
            }}
            getOptions={getProviders}
            component={SingleSelectFormField}
            onChange={handleSearchProviderChange}
            value={values.product_search_provider}
          />
        </Grid>
        <Grid item xs={6} md={1}>
          <Button fullWidth className={classes.filterButton} onClick={handleClearClick}>
            LIMPAR
          </Button>
        </Grid>
        <Grid item xs={6} md={1}>
          <Button
            color='secondary'
            disabled={!isValid || isSubmitting}
            variant='contained'
            fullWidth
            className={classes.filterButton}
            type='submit'
          >
            <FilterListIcon fontSize='small' />
          </Button>
        </Grid>
      </Grid>
    </FormFormik>
  );
}

export default Form;
