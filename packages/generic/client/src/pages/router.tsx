import React, { FunctionComponent } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Home } from './Home';
import { Login } from './Login';
import { ResetPassword } from './ResetPassword';
import { ResetPasswordRequest } from './ResetPasswordRequest';

export { Router };

const Router: FunctionComponent = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/reset-password-request">
        <ResetPasswordRequest />
      </Route>
      <Route path="/reset-password/:resetPasswordToken">
        <ResetPassword />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </BrowserRouter>
);
