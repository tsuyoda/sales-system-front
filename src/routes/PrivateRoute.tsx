import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

function PrivateRoute(props: RouteProps) {
  const { signed } = useAuth();

  // eslint-disable-next-line react/jsx-props-no-spreading
  return signed() ? <Route {...props} /> : <Redirect to='/login' />;
}

export default PrivateRoute;
