import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  tableContainer: {
    borderRadius: 10
  },
  table: {
    minWidth: 650
  },
  deleteModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '5px solid #000',
    borderColor: theme.palette.grey[100],
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 400,
    height: 250,
    borderRadius: 20
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 500
  }
}));

export default useStyles;
