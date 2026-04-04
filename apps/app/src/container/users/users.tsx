import React, { useState, useEffect } from 'react';
import { IconButton, Grid, Typography, Breadcrumbs, Link as Links } from '@mui/material';
import { styled } from '@mui/system';
import { Table } from '../../components/index';
import style from './style';
import AddUser from './components/addUser';
import Confirmation from '../confirmationDialog/index';
import { AddIcon } from '../../assets/svg/index';
import API from '../../utils/api';

interface UserProps {
    className?: string;
}

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

function User(props: UserProps): JSX.Element {
    const { className } = props;

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
        handleOpenAddUser();
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
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userIdTo));
            } else {
                await API.usersDelete(userIdTo as unknown as string);
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userIdTo));
            }
            setDeleteConfirmationOpen(false);
            setConfirmationOpen(false);
            setSnackbarMessage('User deleted successfully');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 6000);
        } catch (error) {
            console.error('Error deleting user:', error);
            setDeleteConfirmationOpen(false);
            setSnackbarMessage('Error deleting user');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 6000);
        }
    };

    const handleOpenAddUser = (): void => {
        setOpenAddUser(true);
    };

    const handleCloseAddUser = (): void => {
        setOpenAddUser(false);
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
            setFormData({
                username: '',
                password: '',
                email: '',
                phone: '',
            });
        }
    }, [editMode, userData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddUser = async (): Promise<void> => {
        if (!formData.username || !formData.password || !formData.email || !formData.phone) {
            setSnackbarMessage('All the fields are required');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 6000);
            return;
        }
        if (editMode && (!('id' in userData))) {
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
                const newUser = response.data;
                setUsers(prevUsers => [...prevUsers, newUser]);
                handleClose();
                setSnackbarMessage('User added successfully');
                setSnackbarOpen(true);
                setTimeout(() => {
                    setSnackbarOpen(false);
                }, 6000);
            }
        } catch (error) {
            console.error('Error adding user:', error);
            if (error && typeof error === 'object' && 'response' in error) {
                console.error('Error Response:', error.response);
            }
            setSnackbarMessage('Error adding user');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 6000);
        }
    };

    const handleClose = (): void => {
        handleCloseAddUser();
    };

    const handleSnackbarClose = (): void => {
        setSnackbarOpen(false);
    };

    return (
        <Grid container className={className}>
            <Grid item xs={12} className='titleContainer'>
                <Grid container justifyContent="space-between">
                    <Grid>
                        <Grid item xs={12} sx={{ pb: 2 }}>
                            <Typography variant='h2' style={{ margin: '0px 10px 0px 0px' }}>{role === 'superadmin' ? 'Super Admin' : 'Users'}</Typography>
                        </Grid>
                    </Grid>
                    <Grid className='userSetting'>
                        <IconButton color='primary' style={{ background: '#004D6C', height: '40px', width: '40px' }} onClick={handleAdd}>
                            <AddIcon />
                        </IconButton>
                        <AddUser
                            open={openAddUser}
                            // editMode={editMode}
                            snackbarOpen={snackbarOpen}
                            snackbarMessage={snackbarMessage}
                            formData={formData}
                            // roleStorage={roleStorage}
                            handleInputChange={handleInputChange}
                            handleAddUser={handleAddUser}
                            handleClose={handleClose}
                            handleSnackbarClose={handleSnackbarClose}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className='boxContainer'>
                <Table
                    headers={["id", "Users", "Mail id", ""]}
                    data={users
                        .slice()
                        .sort((a, b) => b.id - a.id)
                        .map((user) => ({
                            id: user.id,
                            username: user?.username || '',
                            email: user?.email || '',
                        }))}
                    actions={["DELETE"]}
                    handleDelete={(userId) => handleDelete(userId as number)}
                    searchRows={[0, 1, 2]}
                />
            </Grid>
            <Confirmation
                ConfirmationOpen={ConfirmationOpen}
                setConfirmationOpen={setConfirmationOpen}
                handleDeleteConfirmed={handleDeleteConfirmed}
                deletion={deletion}
            />
        </Grid>
    );
}

export default styled(User)(style);