import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import Form from './Form';
import { useStyles } from './styles';
import FilterProductSchema from './validations';
import { IProductFilterParams } from '../../../../interfaces/IProduct';
import { INITIAL_FILTER_VALUES } from '../../../../constants/product';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IProductFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values, actions) => {
    const filters: IProductFilterParams = {};

    if (values.product_search_value) {
      if (values.product_search_type.value === 'product_sku') {
        filters.sku = values.product_search_value;
      } else {
        filters.title = values.product_search_value;
      }
    }

    if (values.product_search_provider.value) {
      filters.provider = values.product_search_provider.value;
    }

    setFilters(filters);
    setPage(0);
    setUpdateRows(true);
    actions.setSubmitting(false);
  }, []);

  return (
    <div className={classes.filter}>
      <Formik initialValues={INITIAL_FILTER_VALUES} validationSchema={FilterProductSchema} onSubmit={handleOnSubmit}>
        <Form />
      </Formik>
    </div>
  );
}

export default Filter;
