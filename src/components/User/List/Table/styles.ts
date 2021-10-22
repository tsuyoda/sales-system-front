import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
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
  }
});

export default useStyles;
