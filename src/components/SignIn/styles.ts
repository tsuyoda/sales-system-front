import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  main: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    marginTop: theme.spacing(1),
    width: '100%'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.light
  },
  submit: {
    margin: theme.spacing(2, 0, 3)
  },
  title: {
    marginBottom: 30
  }
}));

export default useStyles;
