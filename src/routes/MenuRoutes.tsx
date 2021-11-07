import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import User from '../components/User';
import UserRegister from '../components/User/Create';
import UserEdit from '../components/User/Edit';
import Role from '../components/Role';
import RoleRegister from '../components/Role/Create';
import RoleEdit from '../components/Role/Edit';
import OrderRegister from '../components/Order/Create';
import OrderEdit from '../components/Order/Edit';
import ScoreLevelEdit from '../components/ScoreLevel/Edit';
import Order from '../components/Order';
import Product from '../components/Product';
import ProductRegister from '../components/Product/Create';
import ProviderRegister from '../components/Provider/Create';
import CustomerRegister from '../components/Customer/Create';
import BenefitRegister from '../components/Benefit/Create';
import ScoreLevelRegister from '../components/ScoreLevel/Create';
import Provider from '../components/Provider';
import Customer from '../components/Customer';
import Benefit from '../components/Benefit';
import ScoreLevel from '../components/ScoreLevel';
import Score from '../components/Score';
import ProductEdit from '../components/Product/Edit';
import CustomerEdit from '../components/Customer/Edit';
import BenefitEdit from '../components/Benefit/Edit';
import ProviderEdit from '../components/Provider/Edit';
import HistoryPriceInfo from '../components/Product/Forms/HistoryPriceInfo';
import Profile from '../components/Profile';
import ResetPassword from '../components/Profile/ResetPassword';

function MenuRoutes() {
  return (
    <Switch>
      <Route path='/profile' component={Profile} />
      <Route path='/reset-password' component={ResetPassword} />
      <Route path='/product/register' component={ProductRegister} />
      <Route path='/product/:id/edit' component={ProductEdit} />
      <Route path='/product/:id/history-price' component={HistoryPriceInfo} />
      <Route path='/product' component={Product} />
      <Route path='/user/register' component={UserRegister} />
      <Route path='/user/:id/edit' component={UserEdit} />
      <Route path='/user' component={User} />
      <Route path='/role/register' component={RoleRegister} />
      <Route path='/role/:id/edit' component={RoleEdit} />
      <Route path='/role' component={Role} />
      <Route path='/order/register' component={OrderRegister} />
      <Route path='/order/:id/edit' component={OrderEdit} />
      <Route path='/order' component={Order} />
      <Route path='/provider/register' component={ProviderRegister} />
      <Route path='/provider/:id/edit' component={ProviderEdit} />
      <Route path='/provider' component={Provider} />
      <Route path='/customer/register' component={CustomerRegister} />
      <Route path='/customer/:id/edit' component={CustomerEdit} />
      <Route path='/customer' component={Customer} />
      <Route path='/benefit/register' component={BenefitRegister} />
      <Route path='/benefit/:id/edit' component={BenefitEdit} />
      <Route path='/benefit' component={Benefit} />
      <Route path='/score-level/register' component={ScoreLevelRegister} />
      <Route path='/score-level/:id/edit' component={ScoreLevelEdit} />
      <Route path='/score-level' component={ScoreLevel} />
      <Route path='/score' component={Score} />
      <Route path='/' component={Dashboard} />
    </Switch>
  );
}

export default MenuRoutes;
