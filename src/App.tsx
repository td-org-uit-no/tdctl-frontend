import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/molecules/Navbar/Navbar';
import { RegistrerPage, RootPage } from './components/pages';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/registrer" component={RegistrerPage}></Route>
        <Route path="/" component={RootPage}></Route>
      </Switch>
    </Router>
  );
};

export default App;
