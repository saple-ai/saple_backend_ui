import React from "react";

import { PublicLayout } from "../layouts";

interface PublicRouteProps {
  component: React.ComponentType<any>;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ component: Component, ...props }) => (
  // @ts-ignore
  <PublicLayout component={Component} {...props} />
);

export default PublicRoute;
