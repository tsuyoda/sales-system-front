import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { INITIAL_FILTER_VALUES } from '../../../../constants/provider';
import { IProviderFilter, IProviderFilterParams } from '../../../../interfaces/IProvider';
import Form from './Form';
import { useStyles } from './styles';
import FilterProviderSchema from './validations';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IProviderFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values: IProviderFilter, actions) => {
    const filters: IProviderFilterParams = {};

    if (values.provider_search_value) {
      switch (values.provider_search_type.value) {
        case 'provider_name':
          filters.fullName = values.provider_search_value;
          break;
        case 'provider_doc_f':
        case 'provider_doc_j':
          filters.doc = values.provider_search_value;
          break;
        case 'provider_email':
          filters.email = values.provider_search_value;
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
      <Formik initialValues={INITIAL_FILTER_VALUES} validationSchema={FilterProviderSchema} onSubmit={handleOnSubmit}>
        <Form />
      </Formik>
    </div>
  );
}

export default Filter;
