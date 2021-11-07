import { Button, Grid, Paper } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Form as FormFormik, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { useStyles } from './styles';
import TextFormField from '../../../../Shared/FormFields/TextFormField';
import { IScoreLevelFilterForm } from '../../../../../interfaces/IScoreLevel';
import { INITIAL_FILTER_VALUES } from '../../../../../constants/scoreLevel';

function Form() {
  const classes = useStyles();

  const { values, setFieldValue, resetForm, isValid, isSubmitting, touched, errors, setFieldTouched } =
    useFormikContext<IScoreLevelFilterForm>();

  const handleSearchNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('score_level_search_name', true);
    setFieldValue('score_level_search_name', event.target.value);
  };

  const handleClearClick = () => resetForm({ values: INITIAL_FILTER_VALUES });

  return (
    <FormFormik>
      <Grid container spacing={4} component={Paper}>
        <Grid item xs={10}>
          <TextFormField
            id='score_level_search_name'
            name='score_level_search_name'
            InputLabelProps={{ shrink: true }}
            label='Nome'
            error={touched.score_level_search_name && !!errors.score_level_search_name}
            helperText={touched.score_level_search_name && errors.score_level_search_name}
            onChange={handleSearchNameChange}
            value={values.score_level_search_name}
            fullWidth
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
