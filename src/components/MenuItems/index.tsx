import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PaymentIcon from '@material-ui/icons/Payment';
import SecurityIcon from '@material-ui/icons/Security';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faFileInvoice, faUserShield, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import React from 'react';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

function MenuItems() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <List style={{ flexGrow: 1 }}>
      <ListItem button component={Link} to='/order'>
        <ListItemIcon>
          <PaymentIcon />
        </ListItemIcon>
        <ListItemText primary='Pedidos' />
      </ListItem>
      <ListItem button component={Link} to='/invoice'>
        <ListItemIcon>
          <FontAwesomeIcon icon={faFileInvoice} size='lg' style={{ marginLeft: 5 }} />
        </ListItemIcon>
        <ListItemText primary='Notas Fiscais' />
      </ListItem>
      <ListItem button component={Link} to='/product'>
        <ListItemIcon>
          <FontAwesomeIcon icon={faBox} size='lg' style={{ marginLeft: 3 }} />
        </ListItemIcon>
        <ListItemText primary='Produtos' />
      </ListItem>
      <ListItem button component={Link} to='/customer'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Clientes' />
      </ListItem>
      <ListItem button component={Link} to='/user'>
        <ListItemIcon>
          <AssignmentIndIcon />
        </ListItemIcon>
        <ListItemText primary='Usuários' />
      </ListItem>
      <ListItem onClick={handleClick} button>
        <ListItemIcon>
          <FontAwesomeIcon icon={faUserShield} size='lg' style={{ marginLeft: 3 }} />
        </ListItemIcon>
        <ListItemText primary='Nível de acesso' />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          <ListItem button component={Link} to='/role'>
            <ListItemIcon>
              <FontAwesomeIcon icon={faUserCog} size='lg' style={{ marginLeft: 3 }} />
            </ListItemIcon>
            <ListItemText primary='Funções' />
          </ListItem>
          <ListItem button component={Link} to='/permission'>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText primary='Permissões' />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
}

export default MenuItems;
