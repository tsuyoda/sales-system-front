import { CircularProgress, Grid, makeStyles, Paper } from '@material-ui/core';
import axios from 'axios';
import { useFormikContext, Field } from 'formik';
import React, { ChangeEvent, FocusEvent, useCallback, useState } from 'react';
import { ICustomerEditForm } from '../../../../interfaces/ICustomer';
import { IOption } from '../../../../interfaces/IForm';
import RadioFormButtons from '../../../Shared/FormFields/RadioFormButtons';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  },
  docType: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

function PersonalInfo() {
  const classes = useStyles();
  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<ICustomerEditForm>();
  const [loadingPostalCode, setLoadingPostalCode] = useState(false);

  function sleep(delay = 0) {
    return new Promise(resolve => {
      setTimeout(resolve, delay);
    });
  }

  const handlePostalCodeBlur = useCallback(async (event: FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length === 9) {
      setLoadingPostalCode(true);
      await sleep(1e3);
      const { data } = await axios.get(`https://viacep.com.br/ws/${event.target.value}/json/`);

      if (data.erro) {
        setLoadingPostalCode(false);
        return;
      }

      const { data: ibgeData } = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${data.ibge}`
      );

      const ufData = ibgeData['regiao-imediata']['regiao-intermediaria'].UF;

      setFieldValue('customer_address_street', data.logradouro);
      setFieldValue('customer_address_state', { label: ufData.nome, value: ufData.sigla });
      setFieldValue('customer_address_city', { label: ibgeData.nome, value: ibgeData.nome });

      setLoadingPostalCode(false);
    }
  }, []);

  const getStates = useCallback(async () => {
    const { data } = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');

    return data.map((state: { nome: string; sigla: string }) => ({ label: state.nome, value: state.sigla }));
  }, []);

  const getCities = useCallback(async () => {
    if (!values.customer_address_state.value) {
      return [];
    }

    const { data } = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${values.customer_address_state.value}/municipios?orderBy=nome`
    );

    return data.map((city: { nome: string; id: number }) => ({ label: city.nome, value: city.nome }));
  }, [values.customer_address_state]);

  const handleTextOnlyNumberChange = useCallback((event: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, onlyNumbers(event.target.value));
  }, []);

  const handlePostalCodeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');
    setFieldTouched('customer_address_postal_code', true);
    setFieldValue('customer_address_postal_code', onlyNumbers(event.target.value));

    if (onlyNumbers(event.target.value).length === 8) {
      event.target.blur();
    }
  }, []);

  const handleDefaultTextChange = useCallback((event: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, event.target.value);
  }, []);

  const handleAddressStateChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('customer_address_state', true);
    setFieldValue('customer_address_state', value);
    setFieldValue('customer_address_city', { label: '', value: '' });
  }, []);

  const handleAddressCityChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('customer_address_city', true);
    setFieldValue('customer_address_city', value);
  }, []);

  return (
    <div>
      <div className={classes.block}>
        <h2>Dados pessoais</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={3} className={classes.docType}>
            <Field
              id='customer_doc_type'
              name='customer_doc_type'
              label='Titularidade*'
              options={[
                { label: 'Pessoa Física', value: 'F' },
                { label: 'Pessoa Jurídica', value: 'J' }
              ]}
              component={RadioFormButtons}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleDefaultTextChange(event, 'customer_doc_type')}
              value={values.customer_doc_type}
              fullWidth
            />
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Field
                  id='customer_doc_id'
                  name='customer_doc_id'
                  variant='outlined'
                  label={values.customer_doc_type === 'F' ? 'CPF*' : 'CNPJ*'}
                  error={touched.customer_doc_id && !!errors.customer_doc_id}
                  helperText={touched.customer_doc_id && errors.customer_doc_id}
                  component={TextFormField}
                  mask={values.customer_doc_type === 'F' ? '999.999.999-99' : '99.999.999/9999-99'}
                  value={values.customer_doc_id}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleTextOnlyNumberChange(event, 'customer_doc_id')
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  id='customer_full_name'
                  name='customer_full_name'
                  variant='outlined'
                  label={values.customer_doc_type === 'F' ? 'Nome completo*' : 'Razão social*'}
                  error={touched.customer_full_name && !!errors.customer_full_name}
                  helperText={touched.customer_full_name && errors.customer_full_name}
                  component={TextFormField}
                  value={values.customer_full_name}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleDefaultTextChange(event, 'customer_full_name')
                  }
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.block}>
        <h2>Contato</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={6}>
            <Field
              id='customer_contact_email'
              name='customer_contact_email'
              variant='outlined'
              label='E-mail*'
              error={touched.customer_contact_email && !!errors.customer_contact_email}
              helperText={touched.customer_contact_email && errors.customer_contact_email}
              component={TextFormField}
              value={values.customer_contact_email}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleDefaultTextChange(event, 'customer_contact_email')
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              id='customer_contact_tel'
              name='customer_contact_tel'
              variant='outlined'
              label='Telefone*'
              error={touched.customer_contact_tel && !!errors.customer_contact_tel}
              helperText={touched.customer_contact_tel && errors.customer_contact_tel}
              type='tel'
              component={TextFormField}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleTextOnlyNumberChange(event, 'customer_contact_tel')
              }
              value={values.customer_contact_tel}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
      <div className={classes.block}>
        <h2>Endereço</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4}>
            <Field
              id='customer_address_postal_code'
              name='customer_address_postal_code'
              variant='outlined'
              label='CEP*'
              error={touched.customer_address_postal_code && !!errors.customer_address_postal_code}
              helperText={touched.customer_address_postal_code && errors.customer_address_postal_code}
              InputProps={{
                endAdornment: <>{loadingPostalCode ? <CircularProgress color='inherit' size={20} /> : null}</>
              }}
              component={TextFormField}
              onBlur={handlePostalCodeBlur}
              onChange={handlePostalCodeChange}
              mask='99999-999'
              value={values.customer_address_postal_code}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              id='customer_address_state'
              name='customer_address_state'
              textFieldProps={{
                variant: 'outlined',
                label: 'Estado*',
                error: touched.customer_address_state && !!errors.customer_address_state,
                helperText: touched.customer_address_state && errors.customer_address_state?.value
              }}
              getOptions={getStates}
              component={SingleSelectFormField}
              onChange={handleAddressStateChange}
              value={values.customer_address_state}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              id='customer_address_city'
              name='customer_address_city'
              textFieldProps={{
                variant: 'outlined',
                label: 'Cidade*',
                error: touched.customer_address_city && !!errors.customer_address_city,
                helperText: touched.customer_address_city && errors.customer_address_city?.value
              }}
              getOptions={getCities}
              disabled={!values.customer_address_state?.value}
              component={SingleSelectFormField}
              onChange={handleAddressCityChange}
              value={values.customer_address_city}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              variant='outlined'
              id='customer_address_street'
              name='customer_address_street'
              label='Rua*'
              error={touched.customer_address_street && !!errors.customer_address_street}
              helperText={touched.customer_address_street && errors.customer_address_street}
              component={TextFormField}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleDefaultTextChange(event, 'customer_address_street')
              }
              value={values.customer_address_street}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              variant='outlined'
              id='customer_address_complement'
              name='customer_address_complement'
              label='Complemento'
              error={touched.customer_address_complement && !!errors.customer_address_complement}
              helperText={touched.customer_address_complement && errors.customer_address_complement}
              component={TextFormField}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleDefaultTextChange(event, 'customer_address_complement')
              }
              value={values.customer_address_complement}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              type='number'
              variant='outlined'
              id='customer_address_number'
              name='customer_address_number'
              label='Número*'
              error={touched.customer_address_number && !!errors.customer_address_number}
              helperText={touched.customer_address_number && errors.customer_address_number}
              component={TextFormField}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleTextOnlyNumberChange(event, 'customer_address_number')
              }
              value={values.customer_address_number}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default PersonalInfo;
