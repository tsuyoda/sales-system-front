import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  tabs: {
    display: 'flex',
    position: 'fixed',
    top: 80,
    backgroundColor: theme.palette.background.default,
    width: '100%',
    margin: '-40px 0 0 -10px',
    padding: '50px 0 10px 0',
    zIndex: theme.zIndex.appBar
  },
  content: {
    display: 'flex',
    flexDirection: 'column'
  },
  formContainer: {
    flex: 1,
    padding: '40px 15px 0 15px'
  },
  block: {
    marginBottom: 10
  },
  footerButtons: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

export default useStyles;
