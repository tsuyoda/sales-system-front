import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PaymentIcon from '@material-ui/icons/Payment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faFileInvoice, faTruck, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import React from 'react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/auth';
import { useStyles } from './style';

function MenuItems() {
  const classes = useStyles();
  const { loadingPermissions, permissions } = useAuth();

  return loadingPermissions ? null : (
    <List style={{ flexGrow: 1 }}>
      <ListItem button component={Link} to='/order' className={clsx({ [classes.hide]: !permissions?.orders?.read })}>
        <ListItemIcon>
          <PaymentIcon />
        </ListItemIcon>
        <ListItemText primary='Pedidos' />
      </ListItem>
      <ListItem
        button
        component={Link}
        to='/invoice'
        className={clsx({ [classes.hide]: !permissions?.invoices?.read })}
      >
        <ListItemIcon>
          <FontAwesomeIcon icon={faFileInvoice} size='lg' style={{ marginLeft: 5 }} />
        </ListItemIcon>
        <ListItemText primary='Notas Fiscais' />
      </ListItem>
      <ListItem
        button
        component={Link}
        to='/product'
        className={clsx({ [classes.hide]: !permissions?.products?.read })}
      >
        <ListItemIcon>
          <FontAwesomeIcon icon={faBox} size='lg' style={{ marginLeft: 3 }} />
        </ListItemIcon>
        <ListItemText primary='Produtos' />
      </ListItem>
      <ListItem
        button
        component={Link}
        to='/customer'
        className={clsx({ [classes.hide]: !permissions?.customers?.read })}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Clientes' />
      </ListItem>
      <ListItem
        button
        component={Link}
        to='/provider'
        className={clsx({ [classes.hide]: !permissions?.providers?.read })}
      >
        <ListItemIcon>
          <FontAwesomeIcon icon={faTruck} size='lg' style={{ marginLeft: 2.3 }} />
        </ListItemIcon>
        <ListItemText primary='Fornecedores' />
      </ListItem>
      <ListItem button component={Link} to='/user' className={clsx({ [classes.hide]: !permissions?.users?.read })}>
        <ListItemIcon>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText primary='Usuários' />
      </ListItem>
      <ListItem button component={Link} to='/role' className={clsx({ [classes.hide]: !permissions?.roles?.read })}>
        <ListItemIcon>
          <FontAwesomeIcon icon={faUserShield} size='lg' style={{ marginLeft: 3 }} />
        </ListItemIcon>
        <ListItemText primary='Nível de acesso' />
      </ListItem>
    </List>
  );
}

export default MenuItems;
