import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Table } from '../../components/index';
import AddUser from './components/addUser';
import Confirmation from '../confirmationDialog/index';
import AddIcon from '@mui/icons-material/Add';
import API from '../../utils/api';

interface UserData {
    id: number;
    username: string;
    password: string;
    email: string;
    phone: string;
}

interface FormData {
    username: string;
    password: string;
    email: string;
    phone: string;
}

function User(): JSX.Element {
    const [users, setUsers] = useState<UserData[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    // @ts-ignore
    const [userData, setUserData] = useState<UserData | {}>({});
    const [openAddUser, setOpenAddUser] = useState<boolean>(false);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        email: '',
        phone: '',
    });
    // @ts-ignore
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);
    const [ConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);
    const [userIdTo, setUserId] = useState<number | null>(null);
    const [deletion, setDeletion] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserData = async (): Promise<void> => {
            try {
                const response = await API.superadminuserview();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const storedRole = sessionStorage.getItem('role');
        setRole(storedRole || '');
        if (storedRole === 'superadmin') {
            fetchUserData();
        } else {
            fetchUsersData();
        }
    }, []);

    const fetchUsersData = async (): Promise<void> => {
        try {
            const response = await API.users();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAdd = (): void => {
        setEditMode(false);
        setOpenAddUser(true);
    };

    const handleDelete = async (userId: number): Promise<void> => {
        setUserId(userId);
        setDeletion(true);
        setDeleteConfirmationOpen(true);
        setConfirmationOpen(true);
    };

    const handleDeleteConfirmed = async (): Promise<void> => {
        try {
            if (userIdTo === null) return;
            if (role === 'superadmin') {
                await API.superadmindelete(userIdTo as unknown as string);
            } else {
                await API.usersDelete(userIdTo as unknown as string);
            }
            setUsers((prev) => prev.filter((u) => u.id !== userIdTo));
            setDeleteConfirmationOpen(false);
            setConfirmationOpen(false);
            setSnackbarMessage('User deleted successfully');
            setSnackbarOpen(true);
            setTimeout(() => setSnackbarOpen(false), 6000);
        } catch (error) {
            console.error('Error deleting user:', error);
            setDeleteConfirmationOpen(false);
            setSnackbarMessage('Error deleting user');
            setSnackbarOpen(true);
            setTimeout(() => setSnackbarOpen(false), 6000);
        }
    };

    const roleStorage = sessionStorage.getItem('role');

    useEffect(() => {
        if (editMode && 'username' in userData) {
            setFormData({
                username: (userData as UserData).username || '',
                password: (userData as UserData).password || '',
                email: (userData as UserData).email || '',
                phone: (userData as UserData).phone || '',
            });
        } else {
            setFormData({ username: '', password: '', email: '', phone: '' });
        }
    }, [editMode, userData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddUser = async (): Promise<void> => {
        if (!formData.username || !formData.password || !formData.email || !formData.phone) {
            setSnackbarMessage('All the fields are required');
            setSnackbarOpen(true);
            setTimeout(() => setSnackbarOpen(false), 6000);
            return;
        }
        if (editMode && !('id' in userData)) {
            console.error('User data is missing or incomplete');
            return;
        }
        const apiCall = roleStorage === 'superadmin' ? API.superadminregister : API.userspost;
        try {
            if (editMode) {
                setDeletion(false);
                setConfirmationOpen(true);
            } else {
                const response = await apiCall(formData.username, formData.password, formData.email, formData.phone);
                setUsers((prev) => [...prev, response.data]);
                setOpenAddUser(false);
                setSnackbarMessage('User added successfully');
                setSnackbarOpen(true);
                setTimeout(() => setSnackbarOpen(false), 6000);
            }
        } catch (error) {
            console.error('Error adding user:', error);
            setSnackbarMessage('Error adding user');
            setSnackbarOpen(true);
            setTimeout(() => setSnackbarOpen(false), 6000);
        }
    };

    const handleSnackbarClose = (): void => setSnackbarOpen(false);

    const pageTitle = role === 'superadmin' ? 'Super Admin' : 'Users';

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {pageTitle}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                    sx={{
                        borderRadius: '10px',
                        background: '#0f172a',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2,
                        '&:hover': { background: '#1e293b' },
                    }}
                >
                    Add User
                </Button>
                <AddUser
                    open={openAddUser}
                    snackbarOpen={snackbarOpen}
                    snackbarMessage={snackbarMessage}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleAddUser={handleAddUser}
                    handleClose={() => setOpenAddUser(false)}
                    handleSnackbarClose={handleSnackbarClose}
                />
            </Box>

            {/* Table */}
            <Box
                sx={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                }}
            >
                <Table
                    headers={['id', 'Users', 'Mail id', '']}
                    data={users
                        .slice()
                        .sort((a, b) => b.id - a.id)
                        .map((user) => ({
                            id: user.id,
                            username: user?.username || '',
                            email: user?.email || '',
                        }))}
                    actions={['DELETE']}
                    handleDelete={(userId) => handleDelete(userId as number)}
                    searchRows={[0, 1, 2]}
                />
            </Box>

            <Confirmation
                ConfirmationOpen={ConfirmationOpen}
                setConfirmationOpen={setConfirmationOpen}
                handleDeleteConfirmed={handleDeleteConfirmed}
                deletion={deletion}
            />
        </Box>
    );
}

export default User;
