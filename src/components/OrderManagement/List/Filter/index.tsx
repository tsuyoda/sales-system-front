import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { INITIAL_FILTER_VALUES } from '../../../../constants/orderRequest';
import { IOrderRequestFilter, IOrderRequestFilterParams } from '../../../../interfaces/IOrder';
import Form from './Form';
import { useStyles } from './styles';
import FilterUserSchema from './validations';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IOrderRequestFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values: IOrderRequestFilter, actions) => {
    const filters: IOrderRequestFilterParams = {};

    if (values.request_order_cod) {
      filters.orderCod = values.request_order_cod;
    }

    if (values.request_status.value) {
      filters.status = values.request_status.value;
    }

    if (values.request_order_seller.value) {
      filters.seller = values.request_order_seller.value;
    }

    setFilters(filters);
    setPage(0);
    setUpdateRows(true);
    actions.setSubmitting(false);
  }, []);

  return (
    <div className={classes.filter}>
      <Formik initialValues={INITIAL_FILTER_VALUES} validationSchema={FilterUserSchema} onSubmit={handleOnSubmit}>
        <Form />
      </Formik>
    </div>
  );
}

export default Filter;
