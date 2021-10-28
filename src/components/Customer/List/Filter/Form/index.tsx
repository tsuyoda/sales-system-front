import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useStyles } from './styles';
import { IOption } from '../../../../../interfaces/IForm';
import SingleSelectFormField from '../../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../../Shared/FormFields/TextFormField';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/customer';
import { ICustomerFilter } from '../../../../../interfaces/ICustomer';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, setErrors, resetForm, isValid, isSubmitting, touched, errors, setFieldTouched } =
    useFormikContext<ICustomerFilter>();

  const handleSearchTypeChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('customer_search_type', true);
    setFieldValue('customer_search_type', value);
    setFieldValue('customer_search_value', '');
    setErrors({});
  };

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');
    const { customer_search_type } = values;

    const value = ['customer_doc_f', 'customer_doc_j'].includes(customer_search_type.value)
      ? onlyNumbers(event.target.value)
      : event.target.value;

    setFieldTouched('customer_search_value', true);
    setFieldValue('customer_search_value', value);
  };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  const customerSearchTypes = [
    {
      label: 'Nome',
      value: 'customer_name'
    },
    {
      label: 'CPF',
      value: 'customer_doc_f'
    },
    {
      label: 'CNPJ',
      value: 'customer_doc_j'
    },
    {
      label: 'E-mail',
      value: 'customer_email'
    }
  ];

  const searchValueMasks: { [key: string]: string } = {
    customer_doc_f: '999.999.999-99',
    customer_doc_j: '99.999.999/9999-99'
  };

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={12} md={4}>
          <Field
            id='customer_search_type'
            name='customer_search_type'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Tipo de Busca'
            }}
            disableClearable
            options={customerSearchTypes}
            component={SingleSelectFormField}
            onChange={handleSearchTypeChange}
            value={values.customer_search_type}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            id='customer_search_value'
            name='customer_search_value'
            label={values.customer_search_type.label}
            InputLabelProps={{
              shrink: true
            }}
            mask={searchValueMasks[values.customer_search_type.value]}
            fullWidth
            error={touched.customer_search_value && !!errors.customer_search_value}
            helperText={touched.customer_search_value && errors.customer_search_value}
            component={TextFormField}
            onChange={handleSearchValueChange}
            value={values.customer_search_value}
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
