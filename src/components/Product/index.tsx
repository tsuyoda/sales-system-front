import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import TableProduct from './List/Table';
import { useStyles } from './styles';
import Filter from './List/Filter';
import { useAuth } from '../../contexts/auth';
import { IProductFilterParams } from '../../interfaces/IProduct';

function Product() {
  const classes = useStyles();
  const [filters, setFilters] = useState<IProductFilterParams>({});
  const [page, setPage] = useState(0);
  const [updateRows, setUpdateRows] = useState(true);

  const history = useHistory();

  const { permissions } = useAuth();

  const handleCreateButton = () => {
    history.push('/product/register');
  };

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item xs={12} md={11}>
          <Typography paragraph variant='h5' component='h1'>
            Produtos
            <Typography variant='subtitle1' className={classes.subtitle}>
              Gerencie os produtos do sistema
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={12} md={1} className={classes.addButtonGrid}>
          <Button
            color='primary'
            variant='contained'
            fullWidth
            onClick={handleCreateButton}
            startIcon={<AddIcon />}
            className={clsx({ [classes.hide]: !permissions?.products?.create })}
          >
            Criar
          </Button>
        </Grid>
      </Grid>
      <Filter setFilters={setFilters} setPage={setPage} setUpdateRows={setUpdateRows} />
      <TableProduct
        filters={filters}
        page={page}
        setPage={setPage}
        updateRows={updateRows}
        setUpdateRows={setUpdateRows}
      />
    </>
  );
}

export default Product;
