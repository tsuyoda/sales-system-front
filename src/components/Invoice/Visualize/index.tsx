/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';

import { useParams, useHistory } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import PrintIcon from '@material-ui/icons/Print';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import api from '../../../services/api';
import InvoiceDocument from '../Document';
import { IInvoice } from '../../../interfaces/IInvoice';
import { useHeaderTitle } from '../../../contexts/headerTitle';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    marginBottom: 10
  },
  backButton: {
    flex: 1
  }
});

const VisualizeInvoice = () => {
  const classes = useStyles();
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const { setTitle } = useHeaderTitle();

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  useEffect(() => {
    setTitle('Visualizar nota fiscal');
    api.get(`/invoice/${id}`).then(response => {
      const { data } = response.data;

      setInvoice(data);
    });
  }, []);

  return invoice ? (
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
      <InvoiceDocument invoice={invoice} />
    </div>
  ) : null;
};

export default VisualizeInvoice;
