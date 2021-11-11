import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import TableNotification from './List/Table';
import { useStyles } from './styles';
import { useHeaderTitle } from '../../contexts/headerTitle';

function Notification() {
  const classes = useStyles();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Notificações');
  }, []);

  return (
    <>
      <Typography variant='subtitle1' className={classes.subtitle}>
        Mantenha-se atualizado de todos os status do sistema.
      </Typography>
      <TableNotification />
    </>
  );
}

export default Notification;
