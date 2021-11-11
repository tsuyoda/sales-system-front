import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  tableContainer: {
    borderRadius: 10,
    marginTop: 30
  },
  table: {
    minWidth: 650
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 500
  },
  hide: {
    display: 'none'
  },
  pendingContained: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.text.primary,
    borderRadius: 10,
    padding: 5
  },
  approvedContained: {
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.text.primary,
    borderRadius: 10,
    padding: 5
  },
  reprovedContained: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.text.primary,
    borderRadius: 10,
    padding: 5
  }
}));

export default useStyles;
