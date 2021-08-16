import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {
  RegistrerPage,
  HomePage,
  LoginPage,
  ProfilePage,
  SettingsPage,
  CreateEvent,
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
        <PrivateRoute path="/events" component={CreateEvent} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;
