import {
  AppBar,
  Badge,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Dashboard from '../Dashboard';
import Product from '../Product';
import { useAuth } from '../../contexts/auth';

const drawerWidth = 200;

const useStyles = makeStyles(theme => ({
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
  listItems: {
    flexGrow: 1
  },
  content: {
    padding: theme.spacing(3)
  }
}));

function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { signOut } = useAuth();

  const handlerDrawerClose = () => {
    setOpen(false);
  };

  const handlerDrawerOpen = () => {
    setOpen(true);
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position='fixed' className={clsx(classes.appBar, { [classes.appBarShift]: open })}>
          <Toolbar>
            <IconButton
              onClick={handlerDrawerOpen}
              className={clsx(classes.menuButton, { [classes.hide]: open })}
              edge='start'
            >
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' component='h1' className={classes.title} noWrap>
              Home
            </Typography>
            <IconButton>
              <Badge badgeContent={1} color='secondary'>
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant='permanent'
          open={open}
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })}
          classes={{
            paper: clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open
            })
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handlerDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>

          <Divider />
          <List className={classes.listItems}>
            <ListItem button component={Link} to='/product'>
              <ListItemIcon>
                <FontAwesomeIcon icon={faBox} size='lg' />
              </ListItemIcon>
              <ListItemText primary='Produtos' />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleSignOut}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary='Sair' />
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path='/dashboard' component={Dashboard} />
            <Route path='/product' component={Product} />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default Home;
