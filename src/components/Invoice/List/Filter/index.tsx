import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { INITIAL_FILTER_VALUES } from '../../../../constants/invoice';
import { IInvoiceFilterForm, IInvoiceFilterParams } from '../../../../interfaces/IInvoice';
import Form from './Form';
import { useStyles } from './styles';
import FilterUserSchema from './validations';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IInvoiceFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values: IInvoiceFilterForm, actions) => {
    const filters: IInvoiceFilterParams = {};

    if (values.invoice_order_cod) {
      filters.orderCod = values.invoice_order_cod;
    }

    if (values.invoice_customer.value) {
      filters.customer = values.invoice_customer.value;
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
