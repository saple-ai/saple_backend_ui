import React from "react";

import { PrivateLayout } from "../layouts";

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  location?: string;
}

function PrivateRoute({ component: Component, ...props }: PrivateRouteProps) {
  // @ts-ignore
  return <PrivateLayout component={Component} {...props} />;
}

export default PrivateRoute;
