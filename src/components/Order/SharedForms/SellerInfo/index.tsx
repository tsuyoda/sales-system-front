import React, { ChangeEvent, useCallback } from 'react';
import { Paper, makeStyles } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import { AxiosRequestConfig } from 'axios';

import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import { IOrderEditForm } from '../../../../interfaces/IOrder';
import api from '../../../../services/api';
import { ISeller } from '../../../../interfaces/ISeller';
import { IOption } from '../../../../interfaces/IForm';

const useStyles = makeStyles(theme => ({
  block: {
    marginBottom: 30
  },
  sellerError: {
    marginTop: 20,
    color: theme.palette.error.main
  }
}));

function SellerInfo() {
  const classes = useStyles();

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IOrderEditForm>();

  const getSellers = useCallback(async (config: AxiosRequestConfig) => {
    const response = await api.get('/seller', config);
    const { data } = response.data;

    const filteredSellers = data.filter((seller: ISeller) => !!seller.user);

    return filteredSellers.map((seller: ISeller) => ({
      label: seller.user.name,
      value: seller._id,
      searchByLabel: `${seller.user.fullName} ${seller.user.email} ${seller.user.name}`
    }));
  }, []);

  const handleSellerChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('order_seller', true);
    setFieldValue('order_seller', value);
  }, []);

  return (
    <div>
      <h2>Selecione o vendedor</h2>
      <Paper className={classes.block}>
        <Field
          name='order_seller'
          textFieldProps={{
            label: 'Vendedor',
            placeholder: 'Nome, E-mail ou Usuário',
            InputLabelProps: {
              shrink: true
            },
            variant: 'outlined',
            error: touched.order_seller && (!!errors.order_seller?.value || !!errors.order_seller),
            helperText: touched.order_seller && (errors.order_seller?.value || errors.order_seller)
          }}
          onChange={handleSellerChange}
          value={values.order_seller}
          getOptions={getSellers}
          component={SingleSelectFormField}
        />
      </Paper>
    </div>
  );
}

export default SellerInfo;
