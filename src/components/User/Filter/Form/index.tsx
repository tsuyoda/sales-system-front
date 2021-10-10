import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import SingleSelectFormField from '../../../Shared/Form/SingleSelectFormField/index';
import TextFormField from '../../../Shared/Form/TextFormField/index';
import { useStyles } from './styles';
import MultipleSelectFormField from '../../../Shared/Form/MultipleSelectFormField/index';
import { IRole, IUserFilter } from '../../../../interfaces/IUser';
import { INITIAL_FILTER_VALUES } from '../../../../constants/user';
import api from '../../../../services/api';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, setErrors, resetForm, isValid, isSubmitting } = useFormikContext<IUserFilter>();

  const [roleIsLoading, setRoleIsLoading] = useState(true);

  const [roles, setRoles] = useState([]);
  const [totalDocsRoles, setTotalDocsRoles] = useState(0);
  const [limitRoles, setLimitRoles] = useState(5);

  useEffect(() => {
    async function getRoles() {
      const request = await api.get('/role', { params: { sort: 'asc', limit: limitRoles } });

      const { data, paginator } = request.data;

      setRoles(data.map((role: IRole) => ({ label: role.name, value: role.name })));
      setTotalDocsRoles(paginator.totalDocs);
      setRoleIsLoading(false);
    }

    getRoles();
  }, [limitRoles]);

  const handleSearchTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('user_search_type', event.target.value);
    setFieldValue('user_search_text', '');
    setErrors({});
  };

  const handleSearchRuleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('user_search_rule', event.target.value);
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
            label='Usuário'
            id='user_search_type'
            name='user_search_type'
            fullWidth
            options={userSeachTypes}
            component={SingleSelectFormField}
            onChange={handleSearchTypeChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Field
            id='user_search_text'
            name='user_search_text'
            label={values.user_search_type === 'user_email' ? 'E-mail' : 'Nome'}
            InputLabelProps={{
              shrink: true
            }}
            helperText=''
            error={!isValid}
            component={TextFormField}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Field
            label='Função'
            id='user_search_rule'
            name='user_search_rule'
            fullWidth
            options={roles}
            totalOptions={totalDocsRoles}
            isLoading={roleIsLoading}
            component={MultipleSelectFormField}
            onChange={handleSearchRuleChange}
            onMoreOptinsClick={() => {
              setLimitRoles(limitRoles + 5);
            }}
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
