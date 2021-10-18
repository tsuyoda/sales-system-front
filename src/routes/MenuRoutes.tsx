import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Product from '../components/Product';
import User from '../components/User';
import Register from '../components/User/Create';
import Edit from '../components/User/Edit';

function MenuRoutes() {
  return (
    <Switch>
      <Route path='/product' component={Product} />
      <Route path='/user/register' component={Register} />
      <Route path='/user/:id/edit' component={Edit} />
      <Route path='/user' component={User} />
      <Route path='/' component={Dashboard} />
    </Switch>
  );
}

export default MenuRoutes;
