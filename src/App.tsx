import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import React from 'react';

import {
  RegistrerPage,
  HomePage,
  LoginPage,
  ProfilePage,
  CreateEvent,
  EventPage,
  EventAdmin,
  EventOverview,
  EventRegisterPage,
  AdminPage,
  ConfirmationPage,
  RestorePasswordPage,
  ResetPasswordPage,
  Jobs,
  Job,
  CreateJob,
  AboutPage,
  NewStudentsPage,
} from 'components/pages';
import { PrivateRoute, AuthorizationRoute, AdminRoute } from 'routes';
import Navbar from 'components/molecules/navbar/Navbar';
import ToastProvider from 'contexts/toastProvider';

const App: React.FC = () => {
  return (
    <Router>
      <ToastProvider>
        <Navbar />
        <Switch>
          <AuthorizationRoute path="/registrer" component={RegistrerPage} />
          <AuthorizationRoute path="/login" component={LoginPage} />
          <PrivateRoute path="/profile" component={ProfilePage} />
          <PrivateRoute path="/eventoverview" component={EventOverview} />
          <AdminRoute path="/create-event" component={CreateEvent} />
          <AdminRoute path="/admin" component={AdminPage} />
          <AdminRoute path="/event/:id/admin" component={EventAdmin} />
          <Route path="/event/:rid/register" component={EventRegisterPage} />
          <Route path="/event/:id" children={<EventPage />} />
          <Route
            path="/confirmation/:confirmationCode"
            children={<ConfirmationPage />}
          />
          <Route path="/restore-password" component={RestorePasswordPage} />
          <Route
            path="/reset-password/:resetPasswordCode"
            component={ResetPasswordPage}
          />
          <Route path="/jobs/:id" component={Job} />
          <Route path="/jobs" component={Jobs} />
          <AdminRoute path="/create-job" component={CreateJob} />
          <Route
            path="/confirmation/:confirmationCode"
            children={<ConfirmationPage />}
          />
          <Route path="/about-us" component={AboutPage} />
          <Route path="/new-student" component={NewStudentsPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </ToastProvider>
    </Router>
  );
};

export default App;
