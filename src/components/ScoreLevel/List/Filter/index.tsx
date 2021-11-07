import { Formik } from 'formik';
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { INITIAL_FILTER_VALUES } from '../../../../constants/scoreLevel';
import { IScoreLevelFilterParams } from '../../../../interfaces/IScoreLevel';
import Form from './Form';
import { useStyles } from './styles';
import FilterBenefitSchema from './validations';

interface FilterProps {
  setFilters: Dispatch<SetStateAction<IScoreLevelFilterParams>>;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
}

function Filter({ setFilters, setPage, setUpdateRows }: FilterProps) {
  const classes = useStyles();

  const handleOnSubmit = useCallback((values, actions) => {
    const filters: IScoreLevelFilterParams = {};

    if (values.score_level_search_name) {
      filters.name = values.score_level_search_name;
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
