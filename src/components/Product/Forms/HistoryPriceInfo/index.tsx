import React, { useEffect, useState } from 'react';
import {
  IconButton,
  makeStyles,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { useHistory, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import { IProductHistoryPrice } from '../../../../interfaces/IProduct';

const useStyles = makeStyles({
  block: {
    marginBottom: 30
  }
});

function HistoryPriceInfo() {
  const classes = useStyles();
  const history = useHistory();
  const [rows, setRows] = useState<IProductHistoryPrice[]>([]);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    api.get(`/product/${id}/history-price`).then(response => {
      const { data } = response.data;
      setRows(data.reverse());
    });
  }, []);

  return (
    <>
      <IconButton onClick={() => history.goBack()}>
        <KeyboardBackspaceIcon />
      </IconButton>

      <div className={classes.block}>
        <h2>Histórico de Preços</h2>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>
                  <strong>Valor</strong>
                </TableCell>
                <TableCell align='center'>
                  <strong>Data do Registro</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody component={Paper}>
              {rows.map(row => (
                <TableRow>
                  <TableCell component='th' scope='row' align='center'>
                    {`R$ ${row.value.toFixed(2)}`.replace('.', ',')}
                  </TableCell>
                  <TableCell align='center'>{new Date(row.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default HistoryPriceInfo;
