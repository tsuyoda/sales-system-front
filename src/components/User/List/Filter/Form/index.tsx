import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { useStyles } from './styles';
import { IOption } from '../../../../../interfaces/IForm';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/user';
import SingleSelectFormField from '../../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../../Shared/FormFields/TextFormField';
import MultipleSelectFormField from '../../../../Shared/FormFields/MultipleSelectFormField';
import { IRole, IUserFilter } from '../../../../../interfaces/IUser';
import api from '../../../../../services/api';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, setErrors, resetForm, isValid, isSubmitting, touched, errors, setFieldTouched } =
    useFormikContext<IUserFilter>();

  const getRoles = useCallback(async () => {
    const request = await api.get('/role', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((role: IRole) => ({ label: role.name, value: role.name }));
  }, []);

  const handleSearchTypeChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldValue('user_search_type', value);
    setFieldValue('user_search_text', '');
    setErrors({});
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('user_search_text', true);
    setFieldValue('user_search_text', event.target.value);
  };

  const handleSearchRuleChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldValue('user_search_rule', value);
  };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  const userSeachTypes = [
    {
      label: 'E-mail',
      value: 'user_email'
    },
    {
      label: 'Nome',
      value: 'user_name'
    }
  ];

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={12} md={3}>
          <Field
            id='user_search_type'
            name='user_search_type'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Usuário'
            }}
            disableClearable
            options={userSeachTypes}
            component={SingleSelectFormField}
            onChange={handleSearchTypeChange}
            value={values.user_search_type}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Field
            id='user_search_text'
            name='user_search_text'
            label={values.user_search_type?.value === 'user_email' ? 'E-mail' : 'Nome'}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            error={touched.user_search_text && !!errors.user_search_text}
            helperText={touched.user_search_text && errors.user_search_text}
            component={TextFormField}
            onChange={handleSearchTextChange}
            value={values.user_search_text}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field
            id='user_search_rule'
            name='user_search_rule'
            disableCloseOnSelect
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Função'
            }}
            getOptions={getRoles}
            component={MultipleSelectFormField}
            onChange={handleSearchRuleChange}
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
