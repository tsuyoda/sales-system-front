import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useStyles } from './styles';
import { IOption } from '../../../../../interfaces/IForm';
import SingleSelectFormField from '../../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../../Shared/FormFields/TextFormField';
import { IProviderFilter } from '../../../../../interfaces/IProvider';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/provider';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, setErrors, resetForm, isValid, isSubmitting, touched, errors, setFieldTouched } =
    useFormikContext<IProviderFilter>();

  const handleSearchTypeChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('provider_search_type', true);
    setFieldValue('provider_search_type', value);
    setFieldValue('provider_search_value', '');
    setErrors({});
  };

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');
    const { provider_search_type } = values;

    const value = ['provider_doc_f', 'provider_doc_j'].includes(provider_search_type.value)
      ? onlyNumbers(event.target.value)
      : event.target.value;

    setFieldTouched('provider_search_value', true);
    setFieldValue('provider_search_value', value);
  };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  const providerSearchTypes = [
    {
      label: 'Nome',
      value: 'provider_name'
    },
    {
      label: 'CPF',
      value: 'provider_doc_f'
    },
    {
      label: 'CNPJ',
      value: 'provider_doc_j'
    },
    {
      label: 'E-mail',
      value: 'provider_email'
    }
  ];

  const searchValueMasks: { [key: string]: string } = {
    provider_doc_f: '999.999.999-99',
    provider_doc_j: '99.999.999/9999-99'
  };

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={12} md={4}>
          <Field
            id='provider_search_type'
            name='provider_search_type'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Tipo de Busca'
            }}
            disableClearable
            options={providerSearchTypes}
            component={SingleSelectFormField}
            onChange={handleSearchTypeChange}
            value={values.provider_search_type}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            id='provider_search_value'
            name='provider_search_value'
            label={values.provider_search_type.label}
            InputLabelProps={{
              shrink: true
            }}
            mask={searchValueMasks[values.provider_search_type.value]}
            fullWidth
            error={touched.provider_search_value && !!errors.provider_search_value}
            helperText={touched.provider_search_value && errors.provider_search_value}
            component={TextFormField}
            onChange={handleSearchValueChange}
            value={values.provider_search_value}
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
