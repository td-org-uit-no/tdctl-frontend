import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React from 'react';

import {
  RegistrerPage,
  HomePage,
  LoginPage,
  ProfilePage,
  SettingsPage,
  CreateEvent,
  EventPage,
} from 'components/pages';
import { PrivateRoute, AuthorizationRoute, AdminRoute } from 'routes';
import Navbar from 'components/molecules/navbar/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <AuthorizationRoute path="/registrer" component={RegistrerPage} />
        <AuthorizationRoute path="/login" component={LoginPage} />
        <PrivateRoute path="/profile" component={ProfilePage} />
        <PrivateRoute path="/settings" component={SettingsPage} />
        <AdminRoute path="/create-event" component={CreateEvent} />
        <Route path="/event/:id" children={<EventPage />} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;
