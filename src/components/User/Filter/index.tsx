import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { IUserFilterParams } from '../../../interfaces/IUser';
import Form from './Form';
import { useStyles } from './styles';
import FilterUserSchema from './validations';
import { INITIAL_FILTER_VALUES } from '../../../constants/user';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IUserFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
}

function Filter({ setFilters, setPage }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values, actions) => {
    const filters: IUserFilterParams = {};

    if (values.user_search_text) {
      if (values.user_search_type === 'user_email') {
        filters.email = values.user_search_text;
      } else {
        filters.name = values.user_search_text;
      }
    }

    if (values.user_search_rule.length !== 0) {
      filters.role = { name: values.user_search_rule };
    }

    setFilters(filters);
    setPage(0);
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
