/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import PrintIcon from '@material-ui/icons/Print';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import api from '../../../services/api';
import OrderDocument from '../Document';
import { useHeaderTitle } from '../../../contexts/headerTitle';
import { IOrder } from '../../../interfaces/IOrder';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    marginBottom: 10
  },
  backButton: {
    flex: 1
  }
});

const VisualizeOrder = () => {
  const classes = useStyles();
  const [order, setOrder] = useState<IOrder | null>(null);
  const { setTitle } = useHeaderTitle();

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  useEffect(() => {
    setTitle('Visualizar pedido');
    api.get(`/order/${id}`).then(response => {
      const { data } = response.data;

      setOrder(data);
    });
  }, []);

  return order ? (
    <div>
      <div className={classes.header}>
        <div className={classes.backButton}>
          <IconButton onClick={() => history.goBack()}>
            <KeyboardBackspaceIcon />
          </IconButton>
        </div>
        <Button variant='contained' startIcon={<PrintIcon />} color='primary' onClick={window.print}>
          IMPRIMIR
        </Button>
      </div>
      <OrderDocument order={order} />
    </div>
  ) : null;
};

export default VisualizeOrder;
