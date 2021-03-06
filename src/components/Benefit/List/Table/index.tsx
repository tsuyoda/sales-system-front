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
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useStyles } from './styles';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/auth';
import { IBenefit, IBenefitFilterParams } from '../../../../interfaces/IBenefit';

interface TableBenefitProps {
  filters: IBenefitFilterParams;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
  updateRows: boolean;
}

function TableBenefit({ filters, page, setPage, setUpdateRows, updateRows }: TableBenefitProps) {
  const [rows, setRows] = useState<IBenefit[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentBenefit, setCurrentBenefit] = useState<IBenefit>();

  const classes = useStyles();

  const history = useHistory();

  const { permissions } = useAuth();

  const getBenefits = async (params: IBenefitFilterParams) => {
    const request = await api.get('/benefit', { params });

    return request.data;
  };

  const benefitTypeDict: { [key: string]: string } = {
    purchase_discount: 'Desconto em valor de compra',
    shipping_discount: 'Desconto em frete'
  };

  useEffect(() => {
    if (!updateRows) {
      return;
    }

    (async () => {
      const { data, paginator } = await getBenefits({ page: page + 1, limit, ...filters });
      setRows(data as IBenefit[]);
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

  const handleActionsClick = (benefit: IBenefit) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentBenefit(benefit);
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    history.push(`/benefit/${currentBenefit?._id}/edit`);
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
      .delete(`benefit/${currentBenefit?._id}`)
      .then(() => {
        toast.success('Benef??cio exclu??do com sucesso!');
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
              <TableCell>Nome</TableCell>
              <TableCell align='left'>Tipo</TableCell>
              <TableCell align='left'>Valor</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody component={Paper}>
            {rows.map(row => (
              <TableRow key={row._id}>
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='left'>{benefitTypeDict[row.type]}</TableCell>
                <TableCell align='left'>{`${(row.value * 100).toFixed(2)}%`}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    onClick={handleActionsClick(row)}
                    className={clsx({
                      [classes.hide]: !permissions?.benefits?.update && !permissions?.benefits?.delete
                    })}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleActionsClose}>
            <MenuItem onClick={handleEditClick} className={clsx({ [classes.hide]: !permissions?.benefits?.update })}>
              <ListItemIcon>
                <EditIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Editar' />
            </MenuItem>
            <MenuItem
              onClick={handleModalDeleteOpen}
              className={clsx({ [classes.hide]: !permissions?.benefits?.delete })}
            >
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Excluir' />
            </MenuItem>
          </Menu>
          <Dialog open={modalDeleteOpen} onClose={handleModalDeleteClose}>
            <DialogTitle>Voc?? tem certeza que deseja excluir o benef??cio abaixo?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>T??tulo</strong>: {currentBenefit?.name}
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

export default TableBenefit;
