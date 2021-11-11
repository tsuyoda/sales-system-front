import {
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Typography,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { INotification } from '../../../interfaces/INotification';
import webNotificationService from '../../../services/WebNotificationService';
import { useAuth } from '../../../contexts/auth';

function NotificationAppBar() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const history = useHistory();
  const { socket } = useAuth();

  useEffect(() => {
    if (!socket) {
      return;
    }

    webNotificationService.requestPermission();

    socket.on('connect_error', err => {
      console.log(err.message);
    });

    socket.emit('list_unread_notifications');

    socket.on('list_unread_notifications', data => {
      setNotifications(data.docs);
    });

    socket.on('new_notification', notification => {
      socket.emit('list_unread_notifications');
      webNotificationService.newNotification(notification.title, notification.description);
    });
  }, []);

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (id: string, redirect?: string) => () => {
    if (socket) {
      socket.emit('set_notification_viewed', id);
    }

    if (redirect) history.push(redirect);
  };

  return (
    <>
      <IconButton onClick={handleOnClick}>
        <Badge badgeContent={notifications.length} color='secondary'>
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleOnClose}
        PaperProps={{ style: { width: 300, padding: '5px 10px 5px 10px' } }}
      >
        <div style={{ display: 'flex' }}>
          <Typography variant='subtitle1' style={{ flex: 1, fontWeight: 'bold' }} color='textSecondary'>
            NOTIFICAÇÕES
          </Typography>
          <NotificationsNoneIcon />
        </div>
        <Divider />
        <div style={{ margin: '10px 0 10px 0' }}>
          {notifications.length ? (
            notifications.map(notification => (
              <MenuItem onClick={handleNotificationClick(notification._id, notification.redirect)}>
                <ListItemIcon>
                  <LocalOfferIcon />
                </ListItemIcon>
                <ListItemText primary={notification.title} secondary={notification.description} />
              </MenuItem>
            ))
          ) : (
            <div>Não há notificações</div>
          )}
        </div>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={() => history.push('/notification')}>Exibir tudo</Button>
        </div>
      </Menu>
    </>
  );
}

export default NotificationAppBar;
