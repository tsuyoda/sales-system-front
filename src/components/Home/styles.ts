import { makeStyles } from '@material-ui/core';

const drawerWidth = 200;

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  drawer: {
    width: drawerWidth,
    whiteSpace: 'nowrap'
  },
  drawerClose: {
    overflowX: 'hidden',
    width: theme.spacing(7),
    transition: theme.transitions.create(['width'], {
      duration: theme.transitions.duration.leavingScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create(['width'], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.sharp
    })
  },
  hide: {
    display: 'none'
  },
  menuButton: {
    marginRight: 36
  },
  title: {
    flexGrow: 1,
    padding: 0,
    margin: 0
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    padding: theme.spacing(5),
    flexGrow: 1
  }
}));

export default useStyles;
