import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import RootPage from './components/pages/Root';
const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={RootPage}></Route>
      </Switch>
    </Router>
  );
};

export default App;
