import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { INITIAL_FILTER_VALUES } from '../../../../constants/score';
import { IScoreFilterParams, IScoreFilterForm } from '../../../../interfaces/IScore';
import Form from './Form';
import { useStyles } from './styles';
import FilterScoreSchema from './validations';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IScoreFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback(async (values: IScoreFilterForm, actions) => {
    const filters: IScoreFilterParams = {};

    if (values.score_search_customer.value) {
      filters.customer = values.score_search_customer.value;
    }

    if (values.score_search_score_level.value) {
      filters.scoreLevel = values.score_search_score_level.value;
    }

    setFilters(filters);
    setPage(0);
    setUpdateRows(true);
    actions.setSubmitting(false);
  }, []);

  return (
    <div className={classes.filter}>
      <Formik initialValues={INITIAL_FILTER_VALUES} validationSchema={FilterScoreSchema} onSubmit={handleOnSubmit}>
        <Form />
      </Formik>
    </div>
  );
}

export default Filter;
