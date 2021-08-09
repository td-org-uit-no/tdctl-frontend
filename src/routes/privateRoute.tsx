import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AuthenticateContext } from 'contexts/authProvider';

interface PrivateRouteProps extends RouteProps {
  component: any;
}

//Protects protcted pages(login required)
const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { authenticated, isValidating } = useContext(AuthenticateContext);

  if (isValidating) {
    return <div>Redirecting...</div>;
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        authenticated ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: routeProps.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;