import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import TableOrder from './List/Table';
import { useStyles } from './styles';
import Filter from './List/Filter';
import { useAuth } from '../../contexts/auth';
import { IOrderFilterParams } from '../../interfaces/IOrder';
import { useHeaderTitle } from '../../contexts/headerTitle';

function Order() {
  const classes = useStyles();
  const [filters, setFilters] = useState<IOrderFilterParams>({});
  const [page, setPage] = useState(0);
  const [updateRows, setUpdateRows] = useState(true);

  const history = useHistory();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Pedidos');
  }, []);

  const { permissions } = useAuth();

  const handleCreateButton = () => {
    history.push('/order/register');
  };

  return (
    <>
      <Grid container spacing={4} className={classes.header}>
        <Grid item xs={12} md={8}>
          <Typography variant='subtitle1' className={classes.subtitle}>
            Gerencie os pedidos do sistema
          </Typography>
        </Grid>
        <Grid item xs={12} md={2} className={classes.addButtonGrid}>
          <Button color='primary' variant='contained' fullWidth>
            Solicitações
          </Button>
        </Grid>
        <Grid item xs={12} md={2} className={classes.addButtonGrid}>
          <Button
            color='primary'
            variant='contained'
            fullWidth
            onClick={handleCreateButton}
            startIcon={<AddIcon />}
            className={clsx({ [classes.hide]: !permissions?.orders?.create })}
          >
            Criar
          </Button>
        </Grid>
      </Grid>
      <Filter setFilters={setFilters} setPage={setPage} setUpdateRows={setUpdateRows} />
      <TableOrder
        filters={filters}
        page={page}
        setPage={setPage}
        updateRows={updateRows}
        setUpdateRows={setUpdateRows}
      />
    </>
  );
}

export default Order;
