import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AuthenticateContext } from 'contexts/authProvider';

interface PublicRouteProps extends RouteProps {
  component: any;
}

//Reroutes users who are authorized away from pages authorizing user
const AuthorizationRoute: React.FC<PublicRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { authenticated, isValidating } = useContext(AuthenticateContext);

  if (isValidating) {
    return <div></div>;
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        !authenticated ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{ pathname: '/', state: { from: routeProps.location } }}
          />
        )
      }
    />
  );
};

export default AuthorizationRoute;
