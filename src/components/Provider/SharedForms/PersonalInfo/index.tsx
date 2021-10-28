import { CircularProgress, Grid, makeStyles, Paper } from '@material-ui/core';
import axios from 'axios';
import { useFormikContext, Field } from 'formik';
import React, { ChangeEvent, FocusEvent, useCallback, useState } from 'react';
import { IOption } from '../../../../interfaces/IForm';
import { IProviderEditForm } from '../../../../interfaces/IProvider';
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
  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IProviderEditForm>();
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

      setFieldValue('provider_address_street', data.logradouro);
      setFieldValue('provider_address_state', { label: ufData.nome, value: ufData.sigla });
      setFieldValue('provider_address_city', { label: ibgeData.nome, value: ibgeData.nome });

      setLoadingPostalCode(false);
    }
  }, []);

  const getStates = useCallback(async () => {
    const { data } = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');

    return data.map((state: { nome: string; sigla: string }) => ({ label: state.nome, value: state.sigla }));
  }, []);

  const getCities = useCallback(async () => {
    if (!values.provider_address_state.value) {
      return [];
    }

    const { data } = await axios.get(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${values.provider_address_state.value}/municipios?orderBy=nome`
    );

    return data.map((city: { nome: string; id: number }) => ({ label: city.nome, value: city.nome }));
  }, [values.provider_address_state]);

  const handleTextOnlyNumberChange = useCallback((event: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, onlyNumbers(event.target.value));
  }, []);

  const handlePostalCodeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = (text: string) => text.replace(/[^0-9]/g, '');
    setFieldTouched('provider_address_postal_code', true);
    setFieldValue('provider_address_postal_code', onlyNumbers(event.target.value));

    if (onlyNumbers(event.target.value).length === 8) {
      event.target.blur();
    }
  }, []);

  const handleDefaultTextChange = useCallback((event: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, event.target.value);
  }, []);

  const handleAddressStateChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('provider_address_state', true);
    setFieldValue('provider_address_state', value);
    setFieldValue('provider_address_city', { label: '', value: '' });
  }, []);

  const handleAddressCityChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('provider_address_city', true);
    setFieldValue('provider_address_city', value);
  }, []);

  return (
    <div>
      <div className={classes.block}>
        <h2>Dados pessoais</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={3} className={classes.docType}>
            <Field
              id='provider_doc_type'
              name='provider_doc_type'
              label='Titularidade*'
              options={[
                { label: 'Pessoa Física', value: 'F' },
                { label: 'Pessoa Jurídica', value: 'J' }
              ]}
              component={RadioFormButtons}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleDefaultTextChange(event, 'provider_doc_type')}
              value={values.provider_doc_type}
              fullWidth
            />
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Field
                  id='provider_doc_id'
                  name='provider_doc_id'
                  variant='outlined'
                  label={values.provider_doc_type === 'F' ? 'CPF*' : 'CNPJ*'}
                  error={touched.provider_doc_id && !!errors.provider_doc_id}
                  helperText={touched.provider_doc_id && errors.provider_doc_id}
                  component={TextFormField}
                  mask={values.provider_doc_type === 'F' ? '999.999.999-99' : '99.999.999/9999-99'}
                  value={values.provider_doc_id}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleTextOnlyNumberChange(event, 'provider_doc_id')
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  id='provider_full_name'
                  name='provider_full_name'
                  variant='outlined'
                  label={values.provider_doc_type === 'F' ? 'Nome completo*' : 'Razão social*'}
                  error={touched.provider_full_name && !!errors.provider_full_name}
                  helperText={touched.provider_full_name && errors.provider_full_name}
                  component={TextFormField}
                  value={values.provider_full_name}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    handleDefaultTextChange(event, 'provider_full_name')
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
              id='provider_contact_email'
              name='provider_contact_email'
              variant='outlined'
              label='E-mail*'
              error={touched.provider_contact_email && !!errors.provider_contact_email}
              helperText={touched.provider_contact_email && errors.provider_contact_email}
              component={TextFormField}
              value={values.provider_contact_email}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleDefaultTextChange(event, 'provider_contact_email')
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              id='provider_contact_tel'
              name='provider_contact_tel'
              variant='outlined'
              label='Telefone*'
              error={touched.provider_contact_tel && !!errors.provider_contact_tel}
              helperText={touched.provider_contact_tel && errors.provider_contact_tel}
              type='tel'
              component={TextFormField}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleTextOnlyNumberChange(event, 'provider_contact_tel')
              }
              value={values.provider_contact_tel}
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
              id='provider_address_postal_code'
              name='provider_address_postal_code'
              variant='outlined'
              label='CEP*'
              error={touched.provider_address_postal_code && !!errors.provider_address_postal_code}
              helperText={touched.provider_address_postal_code && errors.provider_address_postal_code}
              InputProps={{
                endAdornment: <>{loadingPostalCode ? <CircularProgress color='inherit' size={20} /> : null}</>
              }}
              component={TextFormField}
              onBlur={handlePostalCodeBlur}
              onChange={handlePostalCodeChange}
              mask='99999-999'
              value={values.provider_address_postal_code}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              id='provider_address_state'
              name='provider_address_state'
              textFieldProps={{
                variant: 'outlined',
                label: 'Estado*',
                error: touched.provider_address_state && !!errors.provider_address_state,
                helperText: touched.provider_address_state && errors.provider_address_state?.value
              }}
              getOptions={getStates}
              component={SingleSelectFormField}
              onChange={handleAddressStateChange}
              value={values.provider_address_state}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              id='provider_address_city'
              name='provider_address_city'
              textFieldProps={{
                variant: 'outlined',
                label: 'Cidade*',
                error: touched.provider_address_city && !!errors.provider_address_city,
                helperText: touched.provider_address_city && errors.provider_address_city?.value
              }}
              getOptions={getCities}
              disabled={!values.provider_address_state?.value}
              component={SingleSelectFormField}
              onChange={handleAddressCityChange}
              value={values.provider_address_city}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              variant='outlined'
              id='provider_address_street'
              name='provider_address_street'
              label='Rua*'
              error={touched.provider_address_street && !!errors.provider_address_street}
              helperText={touched.provider_address_street && errors.provider_address_street}
              component={TextFormField}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleDefaultTextChange(event, 'provider_address_street')
              }
              value={values.provider_address_street}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              variant='outlined'
              id='provider_address_complement'
              name='provider_address_complement'
              label='Complemento'
              error={touched.provider_address_complement && !!errors.provider_address_complement}
              helperText={touched.provider_address_complement && errors.provider_address_complement}
              component={TextFormField}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleDefaultTextChange(event, 'provider_address_complement')
              }
              value={values.provider_address_complement}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <Field
              type='number'
              variant='outlined'
              id='provider_address_number'
              name='provider_address_number'
              label='Número*'
              error={touched.provider_address_number && !!errors.provider_address_number}
              helperText={touched.provider_address_number && errors.provider_address_number}
              component={TextFormField}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                handleTextOnlyNumberChange(event, 'provider_address_number')
              }
              value={values.provider_address_number}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default PersonalInfo;
