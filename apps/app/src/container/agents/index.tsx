import React, { useState } from 'react';
import Manage from '../manage/botManagment';

const Agents: React.FC = () => {
    const [, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return <Manage handleSnackbarClose={handleSnackbarClose} />;
};

export default Agents;
