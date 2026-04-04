import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "../routes";
import { PublicLayout } from "../layouts";

import Dashboard from "../container/Dashboard";
import Login from "../container/authentication";
import Agents from "../container/agents";
import Integrations from "../container/integrations";
import Analytics from "../container/analytics";
import Conversations from "../container/conversations";
import Team from "../container/users/users";
import Notification from "../container/notification";
import ApiKeys from "../container/apikeys";
import Subscription from "../container/subscription";

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* @ts-ignore */}
                <Route path="/" element={<PublicLayout component={Login} />} />
                <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                <Route path="/agents" element={<PrivateRoute component={Agents} />} />
                <Route path="/integrations" element={<PrivateRoute component={Integrations} />} />
                <Route path="/analytics" element={<PrivateRoute component={Analytics} />} />
                <Route path="/conversations" element={<PrivateRoute component={Conversations} />} />
                <Route path="/team" element={<PrivateRoute component={Team} />} />
                <Route path="/notification" element={<PrivateRoute component={Notification} />} />
                <Route path="/api-keys" element={<PrivateRoute component={ApiKeys} />} />
                <Route path="/subscription" element={<PrivateRoute component={Subscription} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
