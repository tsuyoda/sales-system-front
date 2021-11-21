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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useStyles } from './styles';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/auth';
import { IScoreFilterParams, IScore } from '../../../../interfaces/IScore';

interface TableScoreProps {
  filters: IScoreFilterParams;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setUpdateRows: Dispatch<SetStateAction<boolean>>;
  updateRows: boolean;
}

function TableScore({ filters, page, setPage, setUpdateRows, updateRows }: TableScoreProps) {
  const [rows, setRows] = useState<IScore[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentScore, setCurrentScore] = useState<IScore>();

  const classes = useStyles();

  const { permissions } = useAuth();

  const getScores = async (params: IScoreFilterParams) => {
    const request = await api.get('/score', { params });

    return request.data;
  };

  useEffect(() => {
    if (!updateRows) {
      return;
    }

    (async () => {
      const { data, paginator } = await getScores({ page: page + 1, limit, ...filters });
      setRows(data as IScore[]);
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

  const handleActionsClick = (scoreLevel: IScore) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentScore(scoreLevel);
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
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
      .delete(`score/${currentScore?._id}`)
      .then(() => {
        toast.success('Pontuação excluída com sucesso!');
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
              <TableCell>Cliente</TableCell>
              <TableCell align='left'>Nível</TableCell>
              <TableCell align='left'>Pontuação</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody component={Paper}>
            {rows.map(row => (
              <TableRow key={row._id}>
                <TableCell component='th' scope='row'>
                  {row.customer.fullName}
                </TableCell>
                <TableCell align='left'>{row.scoreLevel?.name}</TableCell>
                <TableCell align='left'>{row.points}</TableCell>
                <TableCell align='right'>
                  <IconButton
                    onClick={handleActionsClick(row)}
                    className={clsx({
                      [classes.hide]: !permissions?.scores?.update && !permissions?.scores?.delete
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
              onClick={handleModalDeleteOpen}
              className={clsx({ [classes.hide]: !permissions?.scores?.delete })}
            >
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText primary='Excluir' />
            </MenuItem>
          </Menu>
          <Dialog open={modalDeleteOpen} onClose={handleModalDeleteClose}>
            <DialogTitle>Você tem certeza que deseja excluir o nível abaixo?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Cliente</strong>: {currentScore?.customer.fullName}
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

export default TableScore;
