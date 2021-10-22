import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles({
  header: {
    marginBottom: 20
  },
  subtitle: {
    color: 'gray'
  },
  addButtonGrid: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 5
  },
  hide: {
    display: 'none'
  }
});

export default useStyles;
