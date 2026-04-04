import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Grid, Typography, Breadcrumbs, Link as Links, Card, CardContent, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../../utils/api';
import AddUser from './components/addTenant';
import style from './style';
import Confirmation from '../confirmationDialog/index';
import { MenuIcon } from '../../assets/svg/index';

import { Tenant, User as UserType, FormData } from '../../utils/types';

interface UserProps {
    className?: string;
}

function User(props: UserProps): JSX.Element {
    const { className } = props;
    const [tenant, setTenant] = useState<Tenant[]>([]);
    const [openAddUser, setOpenAddUser] = useState<boolean>(false);
    const [users, setUsers] = useState<UserType[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        domain: '',
        email: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_phone: ''
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
    const [ConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);
    const [deletion, setDeletion] = useState<boolean>();

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const tenantResponse = await API.tenants();
                setTenant(tenantResponse.data);
                const usersResponse = await API.users();
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleAdd = (): void => {
        handleOpenAddUser();
    };

    const handleOpenAddUser = (): void => {
        setOpenAddUser(true);
    };

    const handleCloseAddUser = (): void => {
        setOpenAddUser(false);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, tenantId: number): void => {
        setSelectedTenantId(tenantId);
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (): void => {
        setSelectedTenantId(null);
        setAnchorEl(null);
    };

    const handleDeleteTenant = (): void => {
        setConfirmationOpen(true);
        setDeletion(true);
    };

    const handleDeleteConfirmed = async (): Promise<void> => {
        try {
            if (selectedTenantId !== null) {
                await API.tenantsDelete(selectedTenantId as unknown as string);
                setTenant((prevTenant) => prevTenant.filter((user) => user.id !== selectedTenantId));
                setConfirmationOpen(false);
                setSnackbarMessage('User deleted successfully');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setSnackbarMessage('Error deleting user');
            setSnackbarOpen(true);
        }
    };

    const getUserCountInTenant = (tenantId: number): number => {
        const tenantUsers = users.filter(user => user.tenant === tenantId);
        return tenantUsers.length;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleTenantAddUser = (): void => {
        if (!formData.name || !formData.domain || !formData.email || !formData.contact_person_name || !formData.contact_person_email || !formData.contact_person_phone) {
            setSnackbarMessage('All fields are required');
            setSnackbarOpen(true);
            return;
        }

        const userData = {
            name: formData.name,
            domain: formData.domain,
            email: formData.email,
            contact_person_name: formData.contact_person_name,
            contact_person_email: formData.contact_person_email,
            contact_person_phone: formData.contact_person_phone
        };

        API.tenantsPost(userData.name, userData.domain, userData.email, userData.contact_person_name, userData.contact_person_email, userData.contact_person_phone)
            .then(response => {
                handleClose();
                setSnackbarMessage('Tenant added successfully');
                setSnackbarOpen(true);
                setTenant([...tenant, response.data]);
            })
            .catch(error => {
                console.error('Error adding tenant:', error);
                setSnackbarMessage('Error adding tenant');
                setSnackbarOpen(true);
            });
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
                                <Typography color="text.primary">Tenant</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} sx={{ pb: 2 }}>
                            <Typography variant='h2' style={{ margin: '0px 10px 0px 0px' }}>Tenant</Typography>
                        </Grid>
                    </Grid>
                    <Grid className='userSetting'>
                        <IconButton color='primary' style={{ background: '#004D6C', width: '100px', height: '40px', borderRadius: '20px', fontSize: '16px', color: 'white' }} onClick={handleAdd}>
                            <AddIcon style={{ fill: '#fff' }} />
                             Tenant
                        </IconButton>
                        <AddUser
                            open={openAddUser}
                            snackbarOpen={snackbarOpen}
                            snackbarMessage={snackbarMessage}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleTenantAddUser={handleTenantAddUser}
                            handleClose={handleClose}
                            handleSnackbarClose={handleSnackbarClose}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3} className='container' sx={{ pb: 2 }}>
                {tenant.map((tenant) => (
                    <Grid key={tenant.id} item xs={12} md={4} sx={{ '.MuiPaper-root': { boxShadow: '0px 4px 10px #0000000F' } }}>
                        <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <CardContent>
                                <Link to={`/tenant/user/${tenant.id}`} style={{ textDecoration: 'none' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 600, pb: 1 }}>
                                        {tenant.name.toUpperCase()}
                                    </Typography>
                                    <Typography variant='body1'>User Count: {getUserCountInTenant(tenant.id)}</Typography>
                                </Link>
                            </CardContent>
                            <IconButton aria-label="delete" onClick={(event) => handleMenuClick(event, tenant.id)} sx={{ height: '30px' }}>
                                <MenuIcon />
                            </IconButton>
                        </Card>
                        <Menu
                            anchorEl={anchorEl}
                            open={selectedTenantId === tenant.id && Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleDeleteTenant}><DeleteIcon /> Delete</MenuItem>
                        </Menu>
                    </Grid>
                ))}
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