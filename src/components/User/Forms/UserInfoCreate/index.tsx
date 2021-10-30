import { Grid, Paper } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IUserRegisterForm } from '../../../../interfaces/IUser';
import api from '../../../../services/api';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IOption } from '../../../../interfaces/IForm';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  }
});

function UserInfo() {
  const classes = useStyles();
  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IUserRegisterForm>();

  const getRoles = useCallback(async () => {
    const { data } = await api.get('/role');

    const { data: roles } = data;

    // eslint-disable-next-line no-underscore-dangle
    return roles.map((role: { name: string; _id: string }) => ({ label: role.name, value: role._id }));
  }, []);

  const handleRoleChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('user_role', true);
    setFieldValue('user_role', value);
  }, []);

  const handleEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('user_email', true);
    setFieldValue('user_email', event.target.value);
  }, []);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('user_name', true);
    setFieldValue('user_name', event.target.value);
  }, []);

  const handlePasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('user_password', true);
    setFieldValue('user_password', event.target.value);
  }, []);

  return (
    <div>
      <div className={classes.block}>
        <h2>Dados do usuário</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={12}>
            <Field
              variant='outlined'
              id='user_email'
              name='user_email'
              label='E-mail*'
              error={touched.user_email && !!errors.user_email}
              helperText={touched.user_email && errors.user_email}
              component={TextFormField}
              onChange={handleEmailChange}
              value={values.user_email}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              variant='outlined'
              id='user_name'
              name='user_name'
              label='Usuário*'
              error={touched.user_name && !!errors.user_name}
              helperText={touched.user_name && errors.user_name}
              component={TextFormField}
              onChange={handleNameChange}
              value={values.user_name}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              variant='outlined'
              type='password'
              id='user_password'
              name='user_password'
              label='Senha*'
              error={touched.user_password && !!errors.user_password}
              helperText={touched.user_password && errors.user_password}
              component={TextFormField}
              onChange={handlePasswordChange}
              value={values.user_password}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
      <div className={classes.block}>
        <h2>Nível de acesso</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={12}>
            <Field
              id='user_role'
              name='user_role'
              textFieldProps={{
                label: 'Nível de acesso*',
                variant: 'outlined',
                error: touched.user_role && !!errors.user_role,
                helperText: touched.user_role && errors.user_role?.value
              }}
              getOptions={getRoles}
              component={SingleSelectFormField}
              onChange={handleRoleChange}
              value={values.user_role}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default UserInfo;
