import { Typography, Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import TableInvoice from './List/Table';
import { useStyles } from './styles';
import Filter from './List/Filter';
import { useHeaderTitle } from '../../contexts/headerTitle';
import { IInvoiceFilterParams } from '../../interfaces/IInvoice';

function Invoice() {
  const classes = useStyles();
  const [filters, setFilters] = useState<IInvoiceFilterParams>({});
  const [page, setPage] = useState(0);
  const [updateRows, setUpdateRows] = useState(true);

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Notas Fiscais');
  }, []);

  return (
    <>
      <Grid container spacing={4} className={classes.header}>
        <Grid item xs={12} md={8}>
          <Typography variant='subtitle1' className={classes.subtitle}>
            Gerencie as notas fiscais do sistema
          </Typography>
        </Grid>
      </Grid>
      <Filter setFilters={setFilters} setPage={setPage} setUpdateRows={setUpdateRows} />
      <TableInvoice
        filters={filters}
        page={page}
        setPage={setPage}
        updateRows={updateRows}
        setUpdateRows={setUpdateRows}
      />
    </>
  );
}

export default Invoice;
