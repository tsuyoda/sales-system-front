import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  header: {
    display: 'flex',
    margin: '24px 0 24px 0'
  },
  nameContainer: {
    display: 'flex',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },
  name: {
    width: 300
  },
  details: {
    backgroundColor: '#202020'
  },
  title: {
    fontWeight: 'bold'
  },
  container: {
    marginTop: 10
  },
  footerButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10
  }
});

export default useStyles;
