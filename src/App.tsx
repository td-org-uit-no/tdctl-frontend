import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/molecules/Navbar/Navbar';
import { RegistrerPage, RootPage } from './components/pages';
import LoginPage from './components/pages/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/registrer" component={RegistrerPage} />
        <Route path="/" component={RootPage} />
      </Switch>
    </Router>
  );
};

export default App;
