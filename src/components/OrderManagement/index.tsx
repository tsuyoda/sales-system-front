import { IconButton, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory } from 'react-router-dom';
import TableOrder from './List/Table';
import { useStyles } from './styles';
import Filter from './List/Filter';
import { IOrderFilterParams } from '../../interfaces/IOrder';
import { useHeaderTitle } from '../../contexts/headerTitle';

function OrderManagemement() {
  const classes = useStyles();
  const [filters, setFilters] = useState<IOrderFilterParams>({});
  const [page, setPage] = useState(0);
  const [updateRows, setUpdateRows] = useState(true);

  const history = useHistory();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Gerenciamento de Pedidos');
  }, []);

  return (
    <>
      <IconButton onClick={() => history.goBack()}>
        <KeyboardBackspaceIcon />
      </IconButton>
      <Typography variant='subtitle1' className={classes.subtitle}>
        Gerencie as solicitações de aprovação de pedido do sistema
      </Typography>
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

export default OrderManagemement;
