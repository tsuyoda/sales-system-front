import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import ReactLoading from 'react-loading';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useStyles } from './styles';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/auth';
import { IOrder, IOrderFilterParams } from '../../../../interfaces/IOrder';

interface TableOrderProps {
  filters: IOrderFilterParams;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
  updateRows: boolean;
}

function TableOrder({ filters, page, setPage, setUpdateRows, updateRows }: TableOrderProps) {
  const [rows, setRows] = useState<IOrder[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<IOrder>();

  const classes = useStyles();

  const history = useHistory();

  const { permissions } = useAuth();

  const getOrders = async (params: IOrderFilterParams) => {
    const request = await api.get('/order', { params });

    return request.data;
  };

  useEffect(() => {
    if (!updateRows) {
      return;
    }

    (async () => {
      const { data, paginator } = await getOrders({ page: page + 1, limit, ...filters });
      setRows(data as IOrder[]);
      setTotalRows(paginator.totalDocs);
      setLoading(false);
      setUpdateRows(false);
    })();
  }, [page, limit, filters, updateRows]);

  const statusDict: { [key: string]: string } = {
    new: 'Novo',
    pending: 'Pendente',
    processed: 'Processado',
    canceled: 'Cancelado'
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
    setUpdateRows(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    setUpdateRows(true);
  };

  const handleActionsClick = (order: IOrder) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentOrder(order);
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    history.push(`/order/${currentOrder?._id}/edit`);
  };

  const handleModalDeleteOpen = () => {
    setAnchorEl(null);
    setModalDeleteOpen(true);
  };

  const handleModalDeleteClose = () => {
    setModalDeleteOpen(false);
  };

  const handleDeleteOnClick = () => {
    api
      .delete(`order/${currentOrder?._id}`)
      .then(() => {
        toast.success('Pedido excluído com sucesso!');
        setUpdateRows(true);
        setModalDeleteOpen(false);
      })
      .catch(err => {
        if (err.response) {
          toast.error(`Falha ao excluir. Erro: ${err.response.data.error}`);
        } else {
          toast.error(`Falha ao excluir.`);
        }
      });
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
              <TableCell>Código</TableCell>
              <TableCell align='left'>Cliente</TableCell>
              <TableCell align='left'>Vendedor</TableCell>
              <TableCell align='left'>Valor Total</TableCell>
              <TableCell align='left'>Status</TableCell>
              <TableCell align='left'>Data</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody component={Paper}>
            {rows.map(row => (
              <TableRow key={row._id}>
                <TableCell component='th' scope='row'>
                  {row.cod}
                </TableCell>
                <TableCell align='left'>{row.customer.fullName}</TableCell>
                <TableCell align='left'>{row.seller.user.fullName}</TableCell>
                <TableCell align='left'>{`R$ ${row.value.total.toFixed(2)}`.replace('.', ',')}</TableCell>
                <TableCell align='left'>{statusDict[row.status]}</TableCell>
                <TableCell align='left'>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    onClick={handleActionsClick(row)}
                    className={clsx({ [classes.hide]: !permissions?.orders?.update && !permissions?.orders?.delete })}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleActionsClose}>
            <MenuItem
              onClick={() => {
                // eslint-disable-next-line no-alert
                alert('Emissão Nota Fiscal');
              }}
            >
              <ListItemIcon>
                <FontAwesomeIcon icon={faFileInvoice} size='sm' style={{ marginLeft: 5 }} />
              </ListItemIcon>
              <ListItemText primary='Emitir Nota Fiscal' />
            </MenuItem>
            <MenuItem onClick={handleEditClick} className={clsx({ [classes.hide]: !permissions?.orders?.update })}>
              <ListItemIcon>
                <EditIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Editar' />
            </MenuItem>
            <MenuItem
              onClick={handleModalDeleteOpen}
              className={clsx({ [classes.hide]: !permissions?.orders?.delete })}
            >
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Excluir' />
            </MenuItem>
          </Menu>
          <Dialog open={modalDeleteOpen} onClose={handleModalDeleteClose}>
            <DialogTitle>Você tem certeza que deseja excluir a função abaixo?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Pedido</strong>: {currentOrder?.cod}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleModalDeleteClose} variant='contained' color='secondary'>
                Cancelar
              </Button>
              <Button onClick={handleDeleteOnClick} variant='contained' color='primary' autoFocus>
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
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

export default TableOrder;
