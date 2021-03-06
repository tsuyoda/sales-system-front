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
import HistoryIcon from '@material-ui/icons/History';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useStyles } from './styles';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/auth';
import { IProduct, IProductFilterParams } from '../../../../interfaces/IProduct';

interface TableProductProps {
  filters: IProductFilterParams;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
  updateRows: boolean;
}

function TableProduct({ filters, page, setPage, setUpdateRows, updateRows }: TableProductProps) {
  const [rows, setRows] = useState<IProduct[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct>();

  const classes = useStyles();

  const history = useHistory();

  const { permissions } = useAuth();

  const getProducts = async (params: IProductFilterParams) => {
    const request = await api.get('/product', { params });

    return request.data;
  };

  useEffect(() => {
    if (!updateRows) {
      return;
    }

    (async () => {
      const { data, paginator } = await getProducts({ page: page + 1, limit, ...filters });
      setRows(data as IProduct[]);
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

  const handleActionsClick = (product: IProduct) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentProduct(product);
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    history.push(`/product/${currentProduct?._id}/edit`);
  };

  const handleHistoryPriceClick = () => {
    history.push(`/product/${currentProduct?._id}/history-price`);
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
      .delete(`product/${currentProduct?._id}`)
      .then(() => {
        toast.success('Produto exclu??do com sucesso!');
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
              <TableCell>SKU</TableCell>
              <TableCell align='left'>T??tulo</TableCell>
              <TableCell align='left'>Quantidade</TableCell>
              <TableCell align='left'>Valor</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody component={Paper}>
            {rows.map(row => (
              <TableRow key={row._id}>
                <TableCell component='th' scope='row'>
                  {row.sku}
                </TableCell>
                <TableCell align='left'>{row.title}</TableCell>
                <TableCell align='left'>{row.quantity}</TableCell>
                <TableCell align='left'>{`R$ ${row.value.toFixed(2)}`.replace('.', ',')}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    onClick={handleActionsClick(row)}
                    className={clsx({
                      [classes.hide]: !permissions?.products?.update && !permissions?.products?.delete
                    })}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleActionsClose}>
            <MenuItem
              onClick={handleHistoryPriceClick}
              className={clsx({ [classes.hide]: !permissions?.products?.update })}
            >
              <ListItemIcon>
                <HistoryIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Hist??rico de Pre??os' />
            </MenuItem>
            <MenuItem onClick={handleEditClick} className={clsx({ [classes.hide]: !permissions?.products?.update })}>
              <ListItemIcon>
                <EditIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Editar' />
            </MenuItem>
            <MenuItem
              onClick={handleModalDeleteOpen}
              className={clsx({ [classes.hide]: !permissions?.products?.delete })}
            >
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Excluir' />
            </MenuItem>
          </Menu>
          <Dialog open={modalDeleteOpen} onClose={handleModalDeleteClose}>
            <DialogTitle>Voc?? tem certeza que deseja excluir o produto abaixo?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>T??tulo</strong>: {currentProduct?.title}
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

export default TableProduct;
