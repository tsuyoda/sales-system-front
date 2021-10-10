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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import React from 'react';
import { IUser } from '../../../interfaces/IUser';
import { useStyles } from './styles';

interface TableUserProps {
  rows: IUser[];
  totalRows: number;
  limit: number;
  page: number;
  handleChangePage(event: unknown, newPage: number): void;
  handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>): void;
}

function TableUser({ rows, totalRows, limit, page, handleChangePage, handleChangeRowsPerPage }: TableUserProps) {
  const classes = useStyles();

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} size='small' aria-label='a dense table'>
          <TableHead>
            <TableRow>
              <TableCell>Nome completo</TableCell>
              <TableCell align='left'>Usuário</TableCell>
              <TableCell align='left'>E-mail</TableCell>
              <TableCell align='left'>Função</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody component={Paper}>
            {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component='th' scope='row'>
                  {row.fullName}
                </TableCell>
                <TableCell align='left'>{row.name}</TableCell>
                <TableCell align='left'>{row.email}</TableCell>
                <TableCell align='left'>{row.role.name}</TableCell>
                <TableCell align='left'>
                  <IconButton>
                    <MoreHorizIcon />
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
        labelRowsPerPage='Linhas por página'
        rowsPerPage={limit}
        page={page}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default TableUser;
