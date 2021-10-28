import { Grid, Paper } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CheckboxFormField from '../../../Shared/FormFields/CheckboxFormField/index';
import { ICustomerEditForm } from '../../../../interfaces/ICustomer';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  },
  percentIcon: {
    marginLeft: 10
  }
});

function PointsProgramInfo() {
  const classes = useStyles();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<ICustomerEditForm>();

  const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('customer_participate_points_program', true);
    setFieldValue('customer_participate_points_program', event.target.checked);
  }, []);

  return (
    <div>
      <div className={classes.block}>
        <h2>Programa de Pontos</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Field
              id='customer_participate_points_program'
              name='customer_participate_points_program'
              label='Participa do Programa de Pontos'
              component={CheckboxFormField}
              onChange={handleCheckboxChange}
              checked={values.customer_participate_points_program}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default PointsProgramInfo;
