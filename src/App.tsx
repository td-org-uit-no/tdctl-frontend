import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import {
  RegistrerPage,
  RootPage,
  LoginPage,
  ProfilePage,
  SettingsPage,
} from 'components/pages';
import Navbar from 'components/molecules/Navbar/Navbar';
import { Authenticated } from 'contexts';
import { verifyAuthentication } from 'utils/auth';

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyAuthentication().then((res) => {
      setAuthenticated(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <Authenticated.Provider
      value={{
        authenticated,
        setAuthenticated: (authenticated) => setAuthenticated(authenticated),
      }}>
      {!isLoading && (
        <Router>
          <Navbar />
          <Switch>
            {!authenticated && (
              <Route path="/registrer" component={RegistrerPage} />
            )}
            {!authenticated && <Route path="/login" component={LoginPage} />}
            {authenticated && (
              <Route path="/settings" component={SettingsPage} />
            )}
            {authenticated && <Route path="/profile" component={ProfilePage} />}
            {authenticated && <Route path="/settings" component={SettingsPage} />}
            <Route path="/" component={RootPage} />
          </Switch>
        </Router>
      )}
    </Authenticated.Provider>
  );
};

export default App;
