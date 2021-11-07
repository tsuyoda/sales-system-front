import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import React, { ChangeEvent, useCallback } from 'react';
import { AxiosRequestConfig } from 'axios';
import AddIcon from '@material-ui/icons/Add';
import TextFormField from '../../../Shared/FormFields/TextFormField';
import { IOption } from '../../../../interfaces/IForm';
import { IScoreLevelEditForm } from '../../../../interfaces/IScoreLevel';
import SingleSelectFormField from '../../../Shared/FormFields/SingleSelectFormField';
import { IBenefit } from '../../../../interfaces/IBenefit';
import api from '../../../../services/api';
import BenefitList from './BenefitList';

const useStyles = makeStyles(theme => ({
  block: {
    marginBottom: 30
  },
  percentIcon: {
    marginLeft: 10
  },
  benefitError: {
    marginTop: 20,
    color: theme.palette.error.main
  }
}));

function ScoreLevelInfo() {
  const classes = useStyles();

  const { touched, errors, values, setFieldValue, setFieldTouched } = useFormikContext<IScoreLevelEditForm>();

  const getBenefits = useCallback(async (config: AxiosRequestConfig) => {
    const response = await api.get('/benefit', config);
    const { data } = response.data;

    return data.map((benefit: IBenefit) => ({
      label: benefit.name,
      value: benefit._id
    }));
  }, []);

  const getBenefit = useCallback(async (id: string) => {
    const response = await api.get(`/benefit/${id}`);
    const { data } = response.data;

    return data;
  }, []);

  const removeBenefit = (index: number) => () => {
    const benefits = [...values.score_level_benefits];

    benefits.splice(index, 1);

    setFieldValue('score_level_benefits', benefits);
  };

  const handleTextChange = (fieldName: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setFieldTouched(fieldName, true);
    setFieldValue(fieldName, event.target.value);
  };

  const handleBenefitChange = useCallback((event: ChangeEvent<HTMLInputElement>, value: IOption) => {
    setFieldTouched('score_level_insert_benefit', true);
    setFieldValue('score_level_insert_benefit', value);
  }, []);

  const handleInsertClick = async () => {
    const benefitData = await getBenefit(values.score_level_insert_benefit.value);

    const benefits = [...values.score_level_benefits];

    const findIndexItem = benefits.findIndex(benefit => benefit._id === values.score_level_insert_benefit.value);

    if (findIndexItem === -1) {
      benefits.push(benefitData);
    }

    setFieldTouched('score_level_benefits', true);
    setFieldValue('score_level_benefits', benefits);
    setFieldValue('score_level_insert_benefit', { label: '', value: '' });
  };

  return (
    <div>
      <div className={classes.block}>
        <h2>Informações do nível</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4}>
            <Field
              variant='outlined'
              name='score_level_name'
              label='Nome'
              component={TextFormField}
              value={values.score_level_name}
              onChange={handleTextChange('score_level_name')}
              error={touched.score_level_name && !!errors.score_level_name}
              helperText={touched.score_level_name && errors.score_level_name}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              variant='outlined'
              id='score_level_pointsThreshold'
              name='score_level_pointsThreshold'
              label='Corte de pontuação'
              type='number'
              error={touched.score_level_pointsThreshold && !!errors.score_level_pointsThreshold}
              helperText={touched.score_level_pointsThreshold && errors.score_level_pointsThreshold}
              component={TextFormField}
              onChange={handleTextChange('score_level_pointsThreshold')}
              value={values.score_level_pointsThreshold}
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
      <div className={classes.block}>
        <h2>Inserir benefício</h2>
        <Grid container spacing={4} component={Paper}>
          <Grid item xs={4}>
            <Field
              name='score_level_insert_benefit'
              textFieldProps={{
                label: 'Benefício',
                placeholder: 'Nome',
                error: touched.score_level_insert_benefit && !!errors.score_level_insert_benefit,
                helperText: touched.score_level_insert_benefit && errors.score_level_insert_benefit
              }}
              getOptions={getBenefits}
              noOptionsText='Benefício não cadastrado'
              component={SingleSelectFormField}
              onChange={handleBenefitChange}
              value={values.score_level_insert_benefit}
              fullWidth
            />
          </Grid>
          <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant='contained'
              color='primary'
              startIcon={<AddIcon fontSize='small' />}
              onClick={handleInsertClick}
              disabled={!values.score_level_insert_benefit?.value}
            >
              Inserir
            </Button>
          </Grid>
        </Grid>
      </div>
      {touched.score_level_benefits && !!errors.score_level_benefits ? (
        <Typography className={classes.benefitError}>{errors.score_level_benefits}</Typography>
      ) : null}
      <div className={classes.block}>
        {values.score_level_benefits?.length !== 0 ? (
          <BenefitList removeItem={removeBenefit} rows={values.score_level_benefits} />
        ) : null}
      </div>
    </div>
  );
}

export default ScoreLevelInfo;
