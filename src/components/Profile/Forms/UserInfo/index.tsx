import { Grid, Paper, Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IProfileForm } from '../../../../interfaces/IProfile';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  },
  resetPasswordButton: {
    display: 'flex',
    justifyContent: 'center'
  }
});

interface UserInfoProps {
  values: IProfileForm;
}

function UserInfo({ values }: UserInfoProps) {
  const classes = useStyles();

  const history = useHistory();

  return (
    <div>
      <div className={classes.block}>
        <h2>Dados do usuário</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={12}>
            <TextFormField
              variant='standard'
              name='user_email'
              label='E-mail'
              value={values.profile_email}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextFormField
              variant='standard'
              name='user_name'
              label='Usuário'
              value={values.profile_name}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} className={classes.resetPasswordButton}>
            <Button variant='contained' color='secondary' onClick={() => history.push('/reset-password')}>
              REDEFINIR SENHA
            </Button>
          </Grid>
        </Grid>
      </div>
      <div className={classes.block}>
        <h2>Nível de acesso</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={12}>
            <SingleSelectFormField
              textFieldProps={{
                label: 'Nível de acesso*',
                variant: 'standard'
              }}
              value={values.profile_role}
              disabled
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default UserInfo;
