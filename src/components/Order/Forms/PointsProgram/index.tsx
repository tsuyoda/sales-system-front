import { makeStyles, Paper, Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React from 'react';
import { IOrderEditForm } from '../../../../interfaces/IOrder';
import { IScore } from '../../../../interfaces/IScore';
import api from '../../../../services/api';
import BenefitList from './BenefitList';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  }
});

function PointsProgram() {
  const classes = useStyles();

  const { values } = useFormikContext<IOrderEditForm>();

  const { order_customer_score: score } = values;

  return values.order_customer?.participatePointsProgram ? (
    <div>
      <div className={classes.block}>
        <h2>Programa de pontos</h2>
        <Grid container component={Paper} style={{ padding: '20px' }}>
          <Grid item xs={4}>
            <strong>Pontuação atual</strong>: {score ? score.points : 0}
          </Grid>
          <Grid item xs={4}>
            <strong>Nível</strong>: {score?.scoreLevel.name || ' - '}
          </Grid>
        </Grid>
        <BenefitList />
      </div>
    </div>
  ) : null;
}

export default PointsProgram;
