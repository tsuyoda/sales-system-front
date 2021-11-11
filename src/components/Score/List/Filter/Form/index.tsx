import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Field, Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { useStyles } from './styles';
import SingleSelectFormField from '../../../../Shared/FormFields/SingleSelectFormField';
import { IOption } from '../../../../../interfaces/IForm';
import { IScoreFilterForm } from '../../../../../interfaces/IScore';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/score';
import api from '../../../../../services/api';
import { IScoreLevel } from '../../../../../interfaces/IScoreLevel';
import { ICustomer } from '../../../../../interfaces/ICustomer';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, resetForm, isValid, isSubmitting, setFieldTouched } =
    useFormikContext<IScoreFilterForm>();

  const getScoreLevels = useCallback(async () => {
    const request = await api.get('/score-level', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((scoreLevel: IScoreLevel) => ({ label: scoreLevel.name, value: scoreLevel._id }));
  }, []);

  const getCustomers = useCallback(async () => {
    const request = await api.get('/customer', { params: { sort: 'asc', limit: 1000 } });
    const { data } = request.data;

    return data.map((customer: ICustomer) => ({
      label: customer.fullName,
      value: customer._id,
      searchByLabel: `${customer.fullName} ${customer.doc.id} ${customer.contact.email}`
    }));
  }, []);

  const handleSearchScoreLevelChange =
    (fieldName: string) => (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
      setFieldTouched(fieldName, true);
      setFieldValue(fieldName, value);
    };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={6}>
          <Field
            id='score_search_customer'
            name='score_search_customer'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              placeholder: 'Nome, Documento ou E-mail',
              label: 'Cliente'
            }}
            getOptions={getCustomers}
            component={SingleSelectFormField}
            onChange={handleSearchScoreLevelChange('score_search_customer')}
            value={values.score_search_customer}
          />
        </Grid>
        <Grid item xs={4}>
          <Field
            id='score_search_score_level'
            name='score_search_score_level'
            textFieldProps={{
              InputLabelProps: {
                shrink: true
              },
              label: 'Nível'
            }}
            getOptions={getScoreLevels}
            component={SingleSelectFormField}
            onChange={handleSearchScoreLevelChange('score_search_score_level')}
            value={values.score_search_score_level}
          />
        </Grid>
        <Grid item xs={1}>
          <Button fullWidth className={classes.filterButton} onClick={handleClearClick}>
            LIMPAR
          </Button>
        </Grid>
        <Grid item xs={1}>
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
