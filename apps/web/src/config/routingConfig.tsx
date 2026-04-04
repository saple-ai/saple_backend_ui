import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "../routes";
import { PublicLayout } from "../layouts";

import Users from '../container/users/users';
import AddUser from '../container/users/components/addUser';
import Dashboard from "../container/Dashboard";
import Login from "../container/authentication";
import Manage from "../container/manage/botManagment";
import ManageAdmin from "../container/manage/superAdminBotCount";
import Tenant from "../container/tenant/tenant";
import TenantUser from "../container/tenant/tenantUser";
import Notification from "../container/notification";

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* @ts-ignore */}
                <Route path="/" element={<PublicLayout component={Login} />} />
                <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                <Route path="/tenant" element={<PrivateRoute component={Tenant} />} />
                <Route path="/users" element={<PrivateRoute component={Users} />} />
                <Route path="/tenant/user/:id" element={<PrivateRoute component={TenantUser} />} />
                <Route path="/add" element={<PrivateRoute component={AddUser} />} />
                <Route path="/notification" element={<PrivateRoute component={Notification} />} />
                <Route path="/manage" element={<PrivateRoute component={Manage} />} />
                <Route path="/manage/bot_category" element={<PrivateRoute component={AddUser} />} /> 
                <Route path="/manageadmin/bot/:id" element={<PrivateRoute component={Manage} />} />
                <Route path="/manageadmin" element={<PrivateRoute component={ManageAdmin} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
