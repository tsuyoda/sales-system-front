import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import TableProvider from './List/Table';
import { useStyles } from './styles';
import Filter from './List/Filter';
import { useAuth } from '../../contexts/auth';
import { IProviderFilterParams } from '../../interfaces/IProvider';
import { useHeaderTitle } from '../../contexts/headerTitle';

function Provider() {
  const classes = useStyles();
  const [filters, setFilters] = useState<IProviderFilterParams>({});
  const [page, setPage] = useState(0);
  const [updateRows, setUpdateRows] = useState(true);

  const history = useHistory();

  const { permissions } = useAuth();
  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Fornecedores');
  }, []);

  const handleCreateButton = () => {
    history.push('/provider/register');
  };

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item xs={12} md={11}>
          <Typography variant='subtitle1' className={classes.subtitle}>
            Gerencie os fornecedores de produto do sistema
          </Typography>
        </Grid>
        <Grid item xs={12} md={1} className={classes.addButtonGrid}>
          <Button
            color='primary'
            variant='contained'
            fullWidth
            onClick={handleCreateButton}
            startIcon={<AddIcon />}
            className={clsx({ [classes.hide]: !permissions?.providers?.create })}
          >
            Criar
          </Button>
        </Grid>
      </Grid>
      <Filter setFilters={setFilters} setPage={setPage} setUpdateRows={setUpdateRows} />
      <TableProvider
        filters={filters}
        page={page}
        setPage={setPage}
        updateRows={updateRows}
        setUpdateRows={setUpdateRows}
      />
    </>
  );
}

export default Provider;
