import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { INITIAL_FILTER_VALUES } from '../../../../constants/benefit';
import { IBenefitFilterParams } from '../../../../interfaces/IBenefit';
import Form from './Form';
import { useStyles } from './styles';
import FilterBenefitSchema from './validations';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IBenefitFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values, actions) => {
    const filters: IBenefitFilterParams = {};

    if (values.benefit_search_name) {
      filters.name = values.benefit_search_name;
    }

    setFilters(filters);
    setPage(0);
    setUpdateRows(true);
    actions.setSubmitting(false);
  }, []);

  return (
    <div className={classes.filter}>
      <Formik initialValues={INITIAL_FILTER_VALUES} validationSchema={FilterBenefitSchema} onSubmit={handleOnSubmit}>
        <Form />
      </Formik>
    </div>
  );
}

export default Filter;
