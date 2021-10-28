import { Grid, InputAdornment, makeStyles, Paper } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent } from 'react';
import { IProductEditForm } from '../../../../interfaces/IProduct';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IOption } from '../../../../interfaces/IForm';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  }
});

function ProductSpecifications() {
  const classes = useStyles();

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IProductEditForm>();

  const measurementUnitTypes = [
    { label: 'Quilograma', value: 'kg' },
    { label: 'Watt', value: 'w' },
    { label: 'Ampere', value: 'a' },
    { label: 'Volts', value: 'v' },
    { label: 'Litro', value: 'l' },
    { label: 'Metro', value: 'm' },
    { label: 'Metro Cúbico', value: 'm³' },
    { label: 'Metro Quadrado', value: 'm²' },
    { label: 'Hertz', value: 'hz' }
  ];

  const handleUnitTypeChange = (event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('product_measurement_unit_type', true);
    setFieldValue('product_measurement_unit_type', value);
  };

  const handleTextChange = (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, event.target.value);
  };

  return (
    <div>
      <div className={classes.block}>
        <h2>Unidade de Medida</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4}>
            <Field
              textFieldProps={{
                variant: 'outlined',
                label: 'Tipo',
                error:
                  touched.product_measurement_unit_type &&
                  (!!errors.product_measurement_unit_type?.value || !!errors.product_measurement_unit_type),
                helperText:
                  touched.product_measurement_unit_type &&
                  (errors.product_measurement_unit_type?.value || errors.product_measurement_unit_type)
              }}
              name='product_measurement_unit_type'
              options={measurementUnitTypes}
              component={SingleSelectFormField}
              value={values.product_measurement_unit_type}
              onChange={handleUnitTypeChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>{values.product_measurement_unit_type?.value}</InputAdornment>
                )
              }}
              disabled={!values.product_measurement_unit_type?.value}
              variant='outlined'
              type='number'
              name='product_measurement_unit_value'
              label='Valor'
              component={TextFormField}
              onChange={handleTextChange('product_measurement_unit_value')}
              value={values.product_measurement_unit_value}
              error={touched.product_measurement_unit_value && !!errors.product_measurement_unit_value}
              helperText={touched.product_measurement_unit_value && errors.product_measurement_unit_value}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
      <div className={classes.block}>
        <h2>Dimensões</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={3}>
            <Field
              InputProps={{
                startAdornment: <InputAdornment position='start'>cm</InputAdornment>
              }}
              variant='outlined'
              type='number'
              name='product_height'
              label='Altura'
              component={TextFormField}
              onChange={handleTextChange('product_height')}
              value={values.product_height}
              error={touched.product_height && !!errors.product_height}
              helperText={touched.product_height && errors.product_height}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              InputProps={{
                startAdornment: <InputAdornment position='start'>cm</InputAdornment>
              }}
              variant='outlined'
              type='number'
              name='product_width'
              label='Largura'
              component={TextFormField}
              onChange={handleTextChange('product_width')}
              value={values.product_width}
              error={touched.product_width && !!errors.product_width}
              helperText={touched.product_width && errors.product_width}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              InputProps={{
                startAdornment: <InputAdornment position='start'>cm</InputAdornment>
              }}
              variant='outlined'
              type='number'
              name='product_length'
              label='Comprimento'
              component={TextFormField}
              onChange={handleTextChange('product_length')}
              value={values.product_length}
              error={touched.product_length && !!errors.product_length}
              helperText={touched.product_length && errors.product_length}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              InputProps={{
                startAdornment: <InputAdornment position='start'>g</InputAdornment>
              }}
              variant='outlined'
              type='number'
              name='product_weight'
              label='Peso'
              component={TextFormField}
              onChange={handleTextChange('product_weight')}
              value={values.product_weight}
              error={touched.product_weight && !!errors.product_weight}
              helperText={touched.product_weight && errors.product_weight}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ProductSpecifications;
