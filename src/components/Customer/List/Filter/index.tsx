import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import Form from './Form';
import { useStyles } from './styles';
import FilterCustomerSchema from './validations';
import { ICustomerFilter, ICustomerFilterParams } from '../../../../interfaces/ICustomer';
import { INITIAL_FILTER_VALUES } from '../../../../constants/customer';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<ICustomerFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values: ICustomerFilter, actions) => {
    const filters: ICustomerFilterParams = {};

    if (values.customer_search_value) {
      switch (values.customer_search_type.value) {
        case 'customer_name':
          filters.fullName = values.customer_search_value;
          break;
        case 'customer_doc_f':
        case 'customer_doc_j':
          filters.doc = values.customer_search_value;
          break;
        case 'customer_email':
          filters.email = values.customer_search_value;
          break;
        default:
          break;
      }
    }
    setFilters(filters);
    setPage(0);
    setUpdateRows(true);
    actions.setSubmitting(false);
  }, []);

  return (
    <div className={classes.filter}>
      <Formik initialValues={INITIAL_FILTER_VALUES} validationSchema={FilterCustomerSchema} onSubmit={handleOnSubmit}>
        <Form />
      </Formik>
    </div>
  );
}

export default Filter;
