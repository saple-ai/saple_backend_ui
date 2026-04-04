import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "../routes";
import { PublicLayout } from "../layouts";

import Dashboard from "../container/Dashboard";
import Login from "../container/authentication";
import Tenant from "../container/tenant/tenant";
import TenantUser from "../container/tenant/tenantUser";
import Users from '../container/users/users';
import Notification from "../container/notification";

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* @ts-ignore */}
                <Route path="/" element={<PublicLayout component={Login} />} />
                <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                <Route path="/tenant" element={<PrivateRoute component={Tenant} />} />
                <Route path="/tenant/user/:id" element={<PrivateRoute component={TenantUser} />} />
                <Route path="/users" element={<PrivateRoute component={Users} />} />
                <Route path="/notification" element={<PrivateRoute component={Notification} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
