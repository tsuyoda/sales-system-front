import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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

  const history = useHistory();
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Níveis de pontuação');
  }, []);

  const { permissions } = useAuth();

  const handleCreateButton = () => {
    history.push('/score-level/register');
  };

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item xs={12} md={11}>
          <Typography variant='subtitle1' className={classes.subtitle}>
            Gerencie os benefícios do programa de pontos
          </Typography>
        </Grid>
        <Grid item xs={12} md={1} className={classes.addButtonGrid}>
          <Button
            color='primary'
            variant='contained'
            fullWidth
            onClick={handleCreateButton}
            startIcon={<AddIcon />}
            className={clsx({ [classes.hide]: !permissions?.scoreLevels?.create })}
          >
            Criar
          </Button>
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
