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
  ListItemText,
  ListItemIcon,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown } from '@fortawesome/free-solid-svg-icons';
import { IResource, IRole, IRoleParams } from '../../../../interfaces/IRole';
import { useStyles } from './styles';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/auth';

function getIconByAction(action: string, key: string) {
  switch (action) {
    case 'create':
      return <AddIcon fontSize='small' titleAccess='Criar' key={`AddIcon.${key}`} />;

    case 'read':
      return <VisibilityIcon fontSize='small' titleAccess='Visualizar' key={`VisibilityIcon.${key}`} />;

    case 'update':
      return <EditIcon fontSize='small' titleAccess='Editar' key={`EditIcon.${key}`} />;

    case 'delete':
      return <DeleteIcon fontSize='small' titleAccess='Deletar' key={`DeleteIcon.${key}`} />;

    default:
      return null;
  }
}

function TableRole() {
  const classes = useStyles();
  const [updateRows, setUpdateRows] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<IRole>();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<IRole[]>([]);
  const [columns, setColumns] = useState<IResource[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const history = useHistory();

  const { permissions } = useAuth();

  const getRoles = async (params: IRoleParams) => {
    const { data } = await api.get('/role', { params });

    return data;
  };

  const getResources = async () => {
    const request = await api.get('/resource', { params: { limit: 100 } });

    const { data } = request.data;

    return data;
  };

  useEffect(() => {
    (async () => {
      const resources = await getResources();

      setColumns(resources);
    })();
  }, []);

  useEffect(() => {
    if (!updateRows) {
      return;
    }

    (async () => {
      const { data, paginator } = await getRoles({ page: page + 1, limit });

      setRows(data as IRole[]);
      setTotalRows(paginator.totalDocs);

      setLoading(false);
      setUpdateRows(false);
    })();
  }, [page, limit, updateRows]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleActionsClick = (role: IRole) => (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentRole(role);
    setAnchorEl(event.currentTarget);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    history.push(`/role/${currentRole?._id}/edit`);
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
      .delete(`role/${currentRole?._id}`)
      .then(() => {
        toast.success('Função excluída com sucesso!');
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
        <Table className={classes.table} size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              {columns.map(resource => (
                <TableCell key={resource._id} align='center'>
                  {resource.translatedName}
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody component={Paper}>
            {rows.map(role => (
              <TableRow key={`TableRow.${role.name}`}>
                <TableCell component='th' scope='row'>
                  {role.name} {role.isAdmin ? <FontAwesomeIcon icon={faCrown} size='sm' color='yellow' /> : null}
                </TableCell>
                {columns.map(resource => (
                  <TableCell align='center' key={`${role.name}.${resource.name}`}>
                    {role.permissions
                      ? role.permissions
                          .filter(permission => permission.resource._id === resource._id)
                          .map(permission =>
                            permission.actions.map(action => getIconByAction(action, `${role.name}.${resource.name}`))
                          )
                      : null}
                  </TableCell>
                ))}
                <TableCell align='right' key={`TableCell.${role.name}`}>
                  {permissions?.roles?.update || permissions?.roles?.delete ? (
                    <IconButton onClick={handleActionsClick(role)}>
                      <MoreHorizIcon />
                    </IconButton>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleActionsClose}>
            {permissions?.roles?.update ? (
              <MenuItem onClick={handleEditClick}>
                <ListItemIcon>
                  <EditIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary='Editar' />
              </MenuItem>
            ) : null}
            {permissions?.roles?.delete ? (
              <MenuItem onClick={handleModalDeleteOpen}>
                <ListItemIcon>
                  <DeleteIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText primary='Excluir' />
              </MenuItem>
            ) : null}
          </Menu>
          <Dialog open={modalDeleteOpen} onClose={handleModalDeleteClose}>
            <DialogTitle>Você tem certeza que deseja excluir a função abaixo?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Nome</strong>: {currentRole?.name}
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

export default TableRole;
