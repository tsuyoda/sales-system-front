import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../components/Home';
import SignIn from '../components/SignIn';
import PrivateRoute from './PrivateRoute';

function Routes() {
  return (
    <Switch>
      <PrivateRoute path='/' exact component={Home} />
      <Route path='/login' component={SignIn} />
      <PrivateRoute path='/' component={Home} />
    </Switch>
  );
}

export default Routes;
