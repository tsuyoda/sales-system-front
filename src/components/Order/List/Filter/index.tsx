import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import Form from './Form';
import { useStyles } from './styles';
import FilterUserSchema from './validations';
import { IOrderFilterParams } from '../../../../interfaces/IOrder';
import { INITIAL_FILTER_VALUES } from '../../../../constants/order';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IOrderFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values, actions) => {
    const filters: IOrderFilterParams = {};

    if (values.order_cod) {
      filters.cod = values.order_cod;
    }

    if (values.order_customer.value) {
      filters.customer = values.order_customer.value;
    }

    if (values.order_seller.value) {
      filters.seller = values.order_seller.value;
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
