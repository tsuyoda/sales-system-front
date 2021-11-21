import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination
} from '@material-ui/core';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useStyles } from './styles';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/auth';
import { IInvoiceFilterParams, IInvoice } from '../../../../interfaces/IInvoice';

interface TableInvoiceProps {
  filters: IInvoiceFilterParams;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
  updateRows: boolean;
}

function TableInvoice({ filters, page, setPage, setUpdateRows, updateRows }: TableInvoiceProps) {
  const [rows, setRows] = useState<IInvoice[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  const classes = useStyles();

  const history = useHistory();

  const { permissions } = useAuth();

  const getOrders = async (params: IInvoiceFilterParams) => {
    const request = await api.get('/invoice', { params });

    return request.data;
  };

  useEffect(() => {
    if (!updateRows) {
      return;
    }

    (async () => {
      const { data, paginator } = await getOrders({ page: page + 1, limit, ...filters });
      setRows(data as IInvoice[]);
      setTotalRows(paginator.totalDocs);
      setLoading(false);
      setUpdateRows(false);
    })();
  }, [page, limit, filters, updateRows]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
    setUpdateRows(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setUpdateRows(true);
  };

  const handleOnClick = (id: string) => () => {
    history.push(`/invoice/${id}`);
  };

  return loading ? (
    <div className={classes.loading}>
      <ReactLoading type='cylon' />
    </div>
  ) : (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Código do Pedido</TableCell>
              <TableCell align='left'>Cliente</TableCell>
              <TableCell align='left'>Valor Total</TableCell>
              <TableCell align='left'>Data de Emissão</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody component={Paper}>
            {rows.map(row => (
              <TableRow key={row._id}>
                <TableCell component='th' scope='row'>
                  {row.order.cod}
                </TableCell>
                <TableCell align='left'>{row.recipient.name}</TableCell>
                <TableCell align='left'>{`R$ ${row.value.total.toFixed(2)}`.replace('.', ',')}</TableCell>
                <TableCell align='left'>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={handleOnClick(row._id)}>
                    <FontAwesomeIcon icon={faFileInvoice} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[1, 5, 10, 25]}
        component='div'
        count={totalRows}
        rowsPerPage={limit}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default TableInvoice;
