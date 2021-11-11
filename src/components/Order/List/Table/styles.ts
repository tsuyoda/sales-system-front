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
  newContained: {
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.text.primary,
    borderRadius: 10,
    padding: 5
  },
  pendingContained: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.text.primary,
    borderRadius: 10,
    padding: 5
  },
  processContained: {
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.text.primary,
    borderRadius: 10,
    padding: 5
  },
  canceledContained: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.text.primary,
    borderRadius: 10,
    padding: 5
  }
}));

export default useStyles;
