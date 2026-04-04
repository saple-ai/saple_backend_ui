import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconButton, Grid, Typography, Breadcrumbs, Link as Links } from '@mui/material';
import { styled } from '@mui/system';
import { Table } from '../../components/index';
import style from './style';
import AddUser from './components/addTenantUser';
import { AddIcon } from '../../assets/svg/index';
import Confirmation from '../confirmationDialog/index';
import API from '../../utils/api';
import { User as UserType } from '../../utils/types';

interface UserProps {
    className?: string;
}

interface UserFormData {
    username: string;
    password: string;
    email: string;
    tenant: string;
    phone: string;
}

interface FilteredUser {
    id: number;
    username: string;
    email: string;
}

function User(props: UserProps): JSX.Element {
    const { className } = props;
    const [users, setUsers] = useState<UserType[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    // @ts-ignore
    const [userData, setUserData] = useState<UserType | {}>({});
    const [openAddUser, setOpenAddUser] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [userFormData, setUserFormData] = useState<UserFormData>({
        username: '',
        password: '',
        email: '',
        tenant: '',
        phone: ''
    });

    // @ts-ignore
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false);
    const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
    const [ConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);
    const [deletion, setDeletion] = useState<boolean>();

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const response = await API.users();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleAdd = (): void => {
        setEditMode(false);
        handleOpenAddUser();
    };

    const handleUserDelete = async (userId: number): Promise<void> => {
        setUserIdToDelete(userId);
        setDeleteConfirmationOpen(true);
        setConfirmationOpen(true);
        setDeletion(true);
    };

    const handleDeleteConfirmed = async (): Promise<void> => {
        try {
            if (userIdToDelete !== null) {
                await API.usersDelete(userIdToDelete as unknown as string);
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userIdToDelete));
                setDeleteConfirmationOpen(false);
                setConfirmationOpen(false);
                setSnackbarMessage('User deleted successfully');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setDeleteConfirmationOpen(false);
            setSnackbarMessage('Error deleting user');
            setSnackbarOpen(true);
        }
    };

    const handleOpenAddUser = (): void => {
        setOpenAddUser(true);
    };

    const handleCloseAddUser = (): void => {
        setOpenAddUser(false);
    };

    const filteredUsers: FilteredUser[] = users
        .filter(user => {
            const userTenantId = user.tenant;
            const match = userTenantId === parseInt(id || '0');
            return match;
        })
        .sort((a, b) => b.id - a.id)
        .map(user => ({
            id: user.id,
            username: user?.username || '',
            email: user?.email || '',
        }));

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = (): void => {
        API.tenants()
            .then(_response => {
            })
            .catch(error => {
                console.error('Error fetching tenants:', error);
            });
    };

    const updateUserFormData = (): void => {
        if (editMode && 'username' in userData) {
            setUserFormData({
                username: userData.username || '',
                password: userData.password || '',
                email: userData.email || '',
                tenant: '',
                phone: userData.phone || '',
            });
        } else {
            setUserFormData({
                username: '',
                password: '',
                email: '',
                tenant: '',
                phone: ''
            });
        }
    };

    useEffect(() => {
        updateUserFormData();
    }, [editMode, userData]);

    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setUserFormData({
            ...userFormData,
            [name]: value,
        });
    };

    const handleAddUser = async (): Promise<void> => {
        if (!userFormData.username || !userFormData.password || !userFormData.email || !userFormData.phone || !id) {
            setSnackbarMessage('All fields are required');
            setSnackbarOpen(true);
            return;
        }
        try {
            const response = await API.userstenatpost(userFormData.username, userFormData.password, userFormData.email, id, userFormData.phone);
            setOpenAddUser(false);
            setUsers([...users, response.data]);
            setSnackbarMessage('User added successfully');
            setSnackbarOpen(true);
            setUserFormData({ username: '', password: '', email: '', tenant: '', phone: '' });
        } catch (error) {
            console.error('Error adding user:', error);
            if (error instanceof Error && 'response' in error) {
                console.error('Error Response:', (error as any).response.data);
            }
            setSnackbarMessage('Error adding user');
            setSnackbarOpen(true);
        }
    };

    const handleEditUser = (): void => {
        setDeletion(false);
        setConfirmationOpen(true);
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
                        <Grid item xs={12} sx={{ pb: 1 }}>
                            <Breadcrumbs separator="››" aria-label="breadcrumb">
                                <Links underline="hover" color="blue" href="/dashboard">
                                    Home
                                </Links>
                                <Links underline="hover" color="blue" href="/tenant">
                                    Tenant
                                </Links>
                                <Typography color="text.primary">Users</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} sx={{ pb: 2 }}>
                            <Typography variant='h2' style={{ margin: '0px 10px 0px 0px' }}>Tenant</Typography>
                        </Grid>
                    </Grid>
                    <Grid className='userSetting'>
                        <IconButton color='primary' style={{ background: '#004D6C', width: '100px', height: '40px', borderRadius: '20px', fontSize: '16px', color: 'white' }} onClick={handleAdd}>
                            <AddIcon />
                         User
                        </IconButton>
                        <AddUser
                            open={openAddUser}
                            editMode={editMode}
                            userFormData={userFormData}
                            snackbarOpen={snackbarOpen}
                            snackbarMessage={snackbarMessage}
                            handleUserInputChange={handleUserInputChange}
                            handleAddUser={handleAddUser}
                            handleEditUser={handleEditUser}
                            handleClose={handleClose}
                            handleSnackbarClose={handleSnackbarClose}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container className='boxContainer'>
                <Table
                    headers={["id", "Users", "Mail id", ""]}
                    data={filteredUsers}
                    actions={["DELETE"]}
                    handleDelete={(userId) => handleUserDelete(userId)}
                    searchRows={[0, 1, 2]}
                />
            </Grid>
            <Confirmation
                ConfirmationOpen={ConfirmationOpen}
                setConfirmationOpen={setConfirmationOpen}
                handleDeleteConfirmed={handleDeleteConfirmed}
                deletion={deletion!}
            />
        </Grid>
    );
}

export default styled(User)(style);