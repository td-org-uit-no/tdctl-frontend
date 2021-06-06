import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {
  RegistrerPage,
  RootPage,
  LoginPage,
  ProfilePage,
  SettingsPage,
} from 'components/pages';
import { PrivateRoute, AuthorizationRoute } from 'routes';
import Navbar from 'components/molecules/Navbar/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <AuthorizationRoute path="/registrer" component={RegistrerPage} />
        <AuthorizationRoute path="/login" component={LoginPage} />
        <PrivateRoute path="/profile" component={ProfilePage} />
        <PrivateRoute path="/settings" component={SettingsPage} />
        <Route path="/" component={RootPage} />
      </Switch>
    </Router>
  );
};

export default App;
