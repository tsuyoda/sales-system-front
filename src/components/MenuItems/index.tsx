import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import BarChartIcon from '@material-ui/icons/BarChart';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PaymentIcon from '@material-ui/icons/Payment';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faFileInvoice,
  faTruck,
  faUserShield,
  faChartBar,
  faLayerGroup,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/auth';
import { useStyles } from './style';

function MenuItems() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { loadingPermissions, permissions } = useAuth();

  return loadingPermissions ? null : (
    <List style={{ flexGrow: 1 }}>
      <ListItem button component={Link} to='/'>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary='Dashboard' />
      </ListItem>
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
      <ListItem
        onClick={() => setOpen(prev => !prev)}
        button
        style={{ paddingRight: 0 }}
        className={clsx({
          [classes.hide]: !permissions?.scores?.read && !permissions?.scoreLevels?.read && !permissions?.benefits?.read
        })}
      >
        <ListItemIcon>
          <LocalAtmIcon />
        </ListItemIcon>
        <ListItemText primary='Programa de Pontos' />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          <ListItem
            button
            component={Link}
            to='/score'
            className={clsx({ [classes.hide]: !permissions?.scores?.read })}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faChartBar} size='lg' style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary='Pontuações' />
          </ListItem>
          <ListItem
            button
            component={Link}
            to='/score-level'
            className={clsx({ [classes.hide]: !permissions?.scoreLevels?.read })}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faLayerGroup} size='lg' style={{ marginLeft: 5 }} />
            </ListItemIcon>
            <ListItemText primary='Níveis' />
          </ListItem>
          <ListItem
            button
            component={Link}
            to='/benefit'
            className={clsx({ [classes.hide]: !permissions?.benefits?.read })}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faStar} size='lg' style={{ marginLeft: 4 }} />
            </ListItemIcon>
            <ListItemText primary='Benefícios' />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
}

export default MenuItems;
