import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import TableBenefit from './List/Table';
import { useStyles } from './styles';
import Filter from './List/Filter';
import { useAuth } from '../../contexts/auth';
import { useHeaderTitle } from '../../contexts/headerTitle';
import { IScoreLevelFilterParams } from '../../interfaces/IScoreLevel';

function ScoreLevel() {
  const classes = useStyles();
  const [filters, setFilters] = useState<IScoreLevelFilterParams>({});
  const [page, setPage] = useState(0);
  const [updateRows, setUpdateRows] = useState(true);

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Pontuações');
  }, []);

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item xs={12} md={11}>
          <Typography variant='subtitle1' className={classes.subtitle}>
            Gerencie os benefícios do programa de pontos
          </Typography>
        </Grid>
      </Grid>
      <Filter setFilters={setFilters} setPage={setPage} setUpdateRows={setUpdateRows} />
      <TableBenefit
        filters={filters}
        page={page}
        setPage={setPage}
        updateRows={updateRows}
        setUpdateRows={setUpdateRows}
      />
    </>
  );
}

export default ScoreLevel;
