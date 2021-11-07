import { Grid, makeStyles, Paper } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent } from '@fortawesome/free-solid-svg-icons';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IOption } from '../../../../interfaces/IForm';
import { IBenefitEditForm } from '../../../../interfaces/IBenefit';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  },
  percentIcon: {
    marginLeft: 10
  }
});

function BenefitInfo() {
  const classes = useStyles();

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IBenefitEditForm>();

  const handleTextChange = (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, event.target.value);
  };

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('benefit_type', true);
    setFieldValue('benefit_type', value);
  };

  const benefitTypes = [
    { label: 'Desconto em valor de compra', value: 'purchase_discount' },
    { label: 'Desconto em frete', value: 'shipping_discount' }
  ];

  return (
    <div>
      <div className={classes.block}>
        <h2>Informações do benefício</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4}>
            <Field
              variant='outlined'
              name='benefit_name'
              label='Nome'
              component={TextFormField}
              value={values.benefit_name}
              onChange={handleTextChange('benefit_name')}
              error={touched.benefit_name && !!errors.benefit_name}
              helperText={touched.benefit_name && errors.benefit_name}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              textFieldProps={{
                variant: 'outlined',
                label: 'Tipo',
                error: touched.benefit_type && (!!errors.benefit_type?.value || !!errors.benefit_type),
                helperText: touched.benefit_type && (errors.benefit_type?.value || errors.benefit_type)
              }}
              name='benefit_type'
              options={benefitTypes}
              component={SingleSelectFormField}
              value={values.benefit_type}
              onChange={handleTypeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              variant='outlined'
              id='benefit_value'
              name='benefit_value'
              label='Valor do desconto'
              type='number'
              error={touched.benefit_value && !!errors.benefit_value}
              helperText={touched.benefit_value && errors.benefit_value}
              component={TextFormField}
              InputProps={{
                endAdornment: <FontAwesomeIcon icon={faPercent} className={classes.percentIcon} />
              }}
              onChange={handleTextChange('benefit_value')}
              value={values.benefit_value}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name='benefit_description'
              label='Descrição'
              variant='outlined'
              multiline
              rows={3}
              rowsMax={4}
              component={TextFormField}
              value={values.benefit_description}
              onChange={handleTextChange('benefit_description')}
              error={touched.benefit_description && !!errors.benefit_description}
              helperText={touched.benefit_description && errors.benefit_description}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default BenefitInfo;
