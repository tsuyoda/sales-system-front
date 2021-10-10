import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import React from 'react';

function MenuItems() {
  return (
    <List style={{ flexGrow: 1 }}>
      <ListItem button component={Link} to='/product'>
        <ListItemIcon>
          <FontAwesomeIcon icon={faBox} size='lg' />
        </ListItemIcon>
        <ListItemText primary='Produtos' />
      </ListItem>
      <ListItem button component={Link} to='/user'>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary='Usuários' />
      </ListItem>
    </List>
  );
}

export default MenuItems;
