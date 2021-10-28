import { Grid, Paper } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent } from '@fortawesome/free-solid-svg-icons';
import { IUserRegisterForm } from '../../../../interfaces/IUser';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import CheckboxFormField from '../../../Shared/FormFields/CheckboxFormField/index';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  },
  percentIcon: {
    marginLeft: 10
  }
});

function SellerInfo() {
  const classes = useStyles();
  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IUserRegisterForm>();

  const handleIsSellerChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    setFieldTouched('user_is_seller', true);
    setFieldValue('user_is_seller', checked);

    if (!checked) {
      setFieldValue('user_seller_comission', 0);
      setFieldValue('user_seller_max_discount', 0);
    }
  }, []);

  const handleComissionChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('user_seller_comission', true);
    setFieldValue('user_seller_comission', event.target.value);
  }, []);

  const handleMaxDiscountChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched('user_seller_max_discount', true);
    setFieldValue('user_seller_max_discount', event.target.value);
  }, []);

  return (
    <div>
      <div className={classes.block}>
        <h2>Dados de Vendedor</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Field
              id='user_is_seller'
              name='user_is_seller'
              label='É vendedor'
              component={CheckboxFormField}
              onChange={handleIsSellerChange}
              checked={values.user_is_seller}
            />
          </Grid>
          <Grid item xs={10}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Field
                  variant='outlined'
                  id='user_seller_comission'
                  name='user_seller_comission'
                  label='Comissão'
                  type='number'
                  disabled={!values.user_is_seller}
                  error={touched.user_seller_comission && !!errors.user_seller_comission}
                  helperText={touched.user_seller_comission && errors.user_seller_comission}
                  component={TextFormField}
                  InputProps={{
                    endAdornment: <FontAwesomeIcon icon={faPercent} className={classes.percentIcon} />
                  }}
                  onChange={handleComissionChange}
                  value={values.user_seller_comission}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  variant='outlined'
                  id='user_seller_max_discount'
                  name='user_seller_max_discount'
                  label='Desconto máximo'
                  type='number'
                  disabled={!values.user_is_seller}
                  error={touched.user_seller_max_discount && !!errors.user_seller_max_discount}
                  helperText={touched.user_seller_max_discount && errors.user_seller_max_discount}
                  component={TextFormField}
                  InputProps={{
                    endAdornment: <FontAwesomeIcon icon={faPercent} className={classes.percentIcon} />
                  }}
                  onChange={handleMaxDiscountChange}
                  value={values.user_seller_max_discount}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default SellerInfo;
