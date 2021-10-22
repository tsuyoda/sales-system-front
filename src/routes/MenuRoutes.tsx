import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Product from '../components/Product';
import User from '../components/User';
import UserRegister from '../components/User/Create';
import UserEdit from '../components/User/Edit';
import Role from '../components/Role';
import RoleRegister from '../components/Role/Create';
import RoleEdit from '../components/Role/Edit';

function MenuRoutes() {
  return (
    <Switch>
      <Route path='/product' component={Product} />
      <Route path='/user/register' component={UserRegister} />
      <Route path='/user/:id/edit' component={UserEdit} />
      <Route path='/user' component={User} />
      <Route path='/role/register' component={RoleRegister} />
      <Route path='/role/:id/edit' component={RoleEdit} />
      <Route path='/role' component={Role} />
      <Route path='/' component={Dashboard} />
    </Switch>
  );
}

export default MenuRoutes;
