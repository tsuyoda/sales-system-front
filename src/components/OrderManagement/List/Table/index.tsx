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
  ListItemText
} from '@material-ui/core';
import ReactLoading from 'react-loading';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useStyles } from './styles';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/auth';
import { IOrderRequest, IOrderRequestFilterParams } from '../../../../interfaces/IOrder';

interface TableOrderManagementProps {
  filters: IOrderRequestFilterParams;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
  updateRows: boolean;
}

function TableOrderManagement({ filters, page, setPage, setUpdateRows, updateRows }: TableOrderManagementProps) {
  const [rows, setRows] = useState<IOrderRequest[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentRequest, setCurrentRequest] = useState<IOrderRequest>();

  const classes = useStyles();

  const history = useHistory();

  const { permissions } = useAuth();

  const getOrderRequests = async (params: IOrderRequestFilterParams) => {
    const request = await api.get('/order-request', { params });

    return request.data;
  };

  useEffect(() => {
    if (!updateRows) {
      return;
    }

    (async () => {
      const { data, paginator } = await getOrderRequests({ page: page + 1, limit, ...filters });
      setRows(data as IOrderRequest[]);
      setTotalRows(paginator.totalDocs);
      setLoading(false);
      setUpdateRows(false);
    })();
  }, [page, limit, filters, updateRows]);

  const statusDict: { [key: string]: ReactElement } = {
    approved: <span className={classes.approvedContained}>Aprovado</span>,
    pending: <span className={classes.pendingContained}>Pendente</span>,
    reproved: <span className={classes.reprovedContained}>Reprovado</span>
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

  const handleMoreClick = (request: IOrderRequest) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentRequest(request);
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleVisualizeOrderClick = () => {
    history.push(`/order/${currentRequest?.order._id}`);
  };

  const handleActionClick = (action: 'approved' | 'reproved') => async () => {
    try {
      await api.post(`/order-request/${currentRequest?._id}/moderate`, { status: action });
      setUpdateRows(true);
      toast.success('Ação efetuada com sucesso!');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(`Falha ao efetuar a ação: ${err.response?.data.error}`);
      } else {
        toast.error(`Falha ao efetuar a ação`);
      }
    }
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
                  {row.order.cod}
                </TableCell>
                <TableCell align='left'>{row.order.customer.fullName}</TableCell>
                <TableCell align='left'>{row.order.seller.user.fullName}</TableCell>
                <TableCell align='left'>{`R$ ${row.order.value.total.toFixed(2)}`.replace('.', ',')}</TableCell>
                <TableCell align='left'>{statusDict[row.status]}</TableCell>
                <TableCell align='left'>{new Date(row.createdAt).toLocaleString()}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    onClick={handleMoreClick(row)}
                    className={clsx({ [classes.hide]: !permissions?.orders?.update && !permissions?.orders?.delete })}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMoreClose}>
            <MenuItem onClick={handleVisualizeOrderClick}>
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              <ListItemText primary='Visualizar Pedido' />
            </MenuItem>
            <MenuItem
              onClick={handleActionClick('approved')}
              className={clsx({
                [classes.hide]: !permissions?.orderManagement?.interact || currentRequest?.status !== 'pending'
              })}
            >
              <ListItemIcon>
                <ThumbUpIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Aprovar' />
            </MenuItem>
            <MenuItem
              onClick={handleActionClick('reproved')}
              className={clsx({
                [classes.hide]: !permissions?.orderManagement?.interact || currentRequest?.status !== 'pending'
              })}
            >
              <ListItemIcon>
                <ThumbDownIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Reprovar' />
            </MenuItem>
          </Menu>
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

export default TableOrderManagement;
