import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ResetPassword from '../pages/ResetPassword';

import Dashboard from '../pages/Dashboard';
import Transactions from '../pages/Transactions';
import ClosedTrades from '../pages/ClosedTrades';
import Profile from '../pages/Profile';
import StatementActive from '../pages/StatementActive';
import StatementClosed from '../pages/StatementClosed';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" exact component={SignUp} />
    <Route path="/reset_password/:token" component={ResetPassword} />

    <Route path="/dashboard" exact component={Dashboard} isPrivate />
    <Route path="/transactions" exact component={Transactions} isPrivate />
    <Route path="/closedtrades" exact component={ClosedTrades} isPrivate />
    <Route path="/profile" exact component={Profile} isPrivate />
    <Route
      path="/statement/active/:asset_id"
      exact
      component={StatementActive}
      isPrivate
    />
    <Route
      path="/statement/closed/:closed_id"
      exact
      component={StatementClosed}
      isPrivate
    />
  </Switch>
);

export default Routes;
