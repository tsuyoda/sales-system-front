import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Product from '../components/Product';
import User from '../components/User';

function MenuRoutes() {
  return (
    <Switch>
      <Route path='/product' component={Product} />
      <Route path='/user' component={User} />
      <Route path='/' component={Dashboard} />
    </Switch>
  );
}

export default MenuRoutes;
