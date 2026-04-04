import React from "react";
import { Route, type RouteProps } from "react-router-dom";

import AuthenticationLayout from "../layouts/authentication";

// @ts-ignore
interface AuthenticationRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const AuthenticationRoute: React.FC<AuthenticationRouteProps> = ({ 
  component: Component, 
  ...rest 
}) => (
  <Route 
    {...rest} 
    // @ts-ignore
    render={(props: any) => (
      // @ts-ignore 
      <AuthenticationLayout>
        <Component {...props} />
      </AuthenticationLayout>
    )}
  />
);

export default AuthenticationRoute;
