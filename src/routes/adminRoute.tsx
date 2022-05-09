import React, { useContext } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AuthenticateContext } from 'contexts/authProvider';

interface PublicRouteProps extends RouteProps {
  component: any;
}

const AdminRoute: React.FC<PublicRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isValidating, role } = useContext(AuthenticateContext);

  if (isValidating) {
    return <div>Redirecting</div>;
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        role === 'admin' ? (
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

export default AdminRoute;
