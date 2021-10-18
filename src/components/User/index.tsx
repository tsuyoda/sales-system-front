import { Typography, Grid, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import { IUserFilterParams, IUser } from '../../interfaces/IUser';
import TableUser from './List/Table';
import { useStyles } from './styles';
import Filter from './List/Filter';

function User() {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<IUser[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters, setFilters] = useState<IUserFilterParams>({});

  const history = useHistory();

  const getUsers = async (params: IUserFilterParams) => {
    const request = await api.get('/user', { params });

    const { data, paginator } = request.data;

    setRows(data as IUser[]);
    setTotalRows(paginator.totalDocs);
    setLoading(false);
  };

  useEffect(() => {
    getUsers({ page: page + 1, limit, ...filters });
  }, [page, limit, filters]);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleCreateButton = () => {
    history.push('/user/register');
  };

  return (
    <>
      <Grid container className={classes.header}>
        <Grid item xs={12} md={11}>
          <Typography paragraph variant='h5' component='h1'>
            Usuários
            <Typography variant='subtitle1' className={classes.subtitle}>
              Gerencie os usuários do sistema
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={12} md={1} className={classes.addButtonGrid}>
          <Button color='primary' variant='contained' fullWidth onClick={handleCreateButton} startIcon={<AddIcon />}>
            Criar
          </Button>
        </Grid>
      </Grid>
      <Filter setFilters={setFilters} setPage={setPage} />
      {loading ? (
        <div className={classes.loading}>
          <ReactLoading type='cylon' />
        </div>
      ) : (
        <TableUser
          rows={rows}
          totalRows={totalRows}
          limit={limit}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </>
  );
}

export default User;
