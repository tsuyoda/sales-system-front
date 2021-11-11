import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ReactLoading from 'react-loading';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStyles } from './styles';
import { INotification } from '../../../../interfaces/INotification';
import { useAuth } from '../../../../contexts/auth';

function TableNotification() {
  const [rows, setRows] = useState<INotification[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  const { socket } = useAuth();

  const classes = useStyles();

  const history = useHistory();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit('list_unread_notifications');

    socket.on('list_notifications', (data: any) => {
      const { docs, totalDocs } = data;
      setRows(docs as INotification[]);
      setTotalRows(totalDocs);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.emit('list_notifications', { page, limit });
  }, [page, limit]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOnClick = (redirect?: string) => () => {
    if (redirect) history.push(redirect);
  };

  return loading ? (
    <div className={classes.loading}>
      <ReactLoading type='cylon' />
    </div>
  ) : (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} size='small'>
          <TableBody component={Paper}>
            {rows.map(row => (
              <TableRow key={row._id}>
                <TableCell style={{ display: 'flex' }}>
                  <MenuItem style={{ width: '100%' }} onClick={handleOnClick(row.redirect)}>
                    <ListItemIcon>
                      <LocalOfferIcon />
                    </ListItemIcon>
                    <ListItemText primary={row.title} secondary={row.description} />
                  </MenuItem>
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

export default TableNotification;
