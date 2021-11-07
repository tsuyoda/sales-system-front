import { Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import RadioFormButtons from '../../../Shared/FormFields/RadioFormButtons';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IProfileForm } from '../../../../interfaces/IProfile';

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

interface PersonalInfoProps {
  values: IProfileForm;
}

function PersonalInfo({ values }: PersonalInfoProps) {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.block}>
        <h2>Dados pessoais</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={3} className={classes.docType}>
            <RadioFormButtons
              label='Titularidade'
              options={[
                { label: 'Pessoa Física', value: 'F' },
                { label: 'Pessoa Jurídica', value: 'J' }
              ]}
              value={values.profile_doc_type}
              disabled
            />
          </Grid>
          <Grid item xs={9}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextFormField
                  variant='standard'
                  label={values.profile_doc_type === 'F' ? 'CPF' : 'CNPJ'}
                  mask={values.profile_doc_type === 'F' ? '999.999.999-99' : '99.999.999/9999-99'}
                  value={values.profile_doc_id}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextFormField
                  variant='standard'
                  label={values.profile_doc_type === 'F' ? 'Nome completo' : 'Razão social'}
                  value={values.profile_full_name}
                  fullWidth
                  disabled
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
            <TextFormField variant='standard' label='E-mail' value={values.profile_contact_email} fullWidth disabled />
          </Grid>
          <Grid item xs={6}>
            <TextFormField
              variant='standard'
              label='Telefone'
              type='tel'
              value={values.profile_contact_tel}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>
      </div>
      <div className={classes.block}>
        <h2>Endereço</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4}>
            <TextFormField
              variant='standard'
              label='CEP'
              mask='99999-999'
              value={values.profile_address_postal_code}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <SingleSelectFormField
              textFieldProps={{
                variant: 'standard',
                label: 'Estado'
              }}
              value={values.profile_address_state}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <SingleSelectFormField
              textFieldProps={{
                variant: 'standard',
                label: 'Cidade'
              }}
              value={values.profile_address_city}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextFormField variant='standard' label='Rua' value={values.profile_address_street} fullWidth disabled />
          </Grid>
          <Grid item xs={4}>
            <TextFormField
              variant='standard'
              label='Complemento'
              value={values.profile_address_complement || ''}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <TextFormField
              type='number'
              variant='standard'
              label='Número'
              value={values.profile_address_number}
              fullWidth
              disabled
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default PersonalInfo;
