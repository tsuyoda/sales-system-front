import {
  AppBar,
  Badge,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useAuth } from '../../contexts/auth';
import MenuRoutes from '../../routes/MenuRoutes';
import MenuItems from '../MenuItems';
import { useStyles } from './styles';

function Home() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const { signOut, user } = useAuth();

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
              Sales System
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
          <MenuItems />
          <Box component='div' className={clsx({ [classes.hide]: !open, [classes.profileBox]: open })}>
            <AccountCircleIcon className={classes.profileIcon} /> {user?.name}
          </Box>
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
          <MenuRoutes />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default Home;
