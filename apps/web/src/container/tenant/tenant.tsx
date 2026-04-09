import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent,
    IconButton, Button, Menu, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import API from '../../utils/api';
import AddUser from './components/addTenant';
import Confirmation from '../confirmationDialog/index';
import { Tenant, User as UserType, FormData } from '../../utils/types';

const cardShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)';

function User(): JSX.Element {
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

    const handleAdd = (): void => setOpenAddUser(true);
    const handleCloseAddUser = (): void => setOpenAddUser(false);

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
                setTenant((prev) => prev.filter((t) => t.id !== selectedTenantId));
                setConfirmationOpen(false);
                setSnackbarMessage('Tenant deleted successfully');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error deleting tenant:', error);
            setSnackbarMessage('Error deleting tenant');
            setSnackbarOpen(true);
        }
    };

    const getUserCountInTenant = (tenantId: number): number =>
        users.filter((u) => u.tenant === tenantId).length;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTenantAddUser = (): void => {
        if (!formData.name || !formData.domain || !formData.email ||
            !formData.contact_person_name || !formData.contact_person_email ||
            !formData.contact_person_phone) {
            setSnackbarMessage('All fields are required');
            setSnackbarOpen(true);
            return;
        }
        API.tenantsPost(
            formData.name, formData.domain, formData.email,
            formData.contact_person_name, formData.contact_person_email,
            formData.contact_person_phone
        )
            .then(response => {
                handleCloseAddUser();
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

    const handleSnackbarClose = (): void => setSnackbarOpen(false);

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    Tenant
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
                    Tenant
                </Button>
                <AddUser
                    open={openAddUser}
                    snackbarOpen={snackbarOpen}
                    snackbarMessage={snackbarMessage}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleTenantAddUser={handleTenantAddUser}
                    handleClose={handleCloseAddUser}
                    handleSnackbarClose={handleSnackbarClose}
                />
            </Box>

            {/* Tenant cards */}
            <Grid container spacing={2.5}>
                {tenant.map((t) => (
                    <Grid key={t.id} item xs={12} md={4}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: '16px',
                                boxShadow: cardShadow,
                                border: '1px solid rgba(0,0,0,0.04)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <CardContent sx={{ flex: 1, py: '16px !important' }}>
                                <Link to={`/tenant/user/${t.id}`} style={{ textDecoration: 'none' }}>
                                    <Typography
                                        sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a', mb: 0.5 }}
                                    >
                                        {t.name.toUpperCase()}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8125rem', color: '#64748b' }}>
                                        User Count: {getUserCountInTenant(t.id)}
                                    </Typography>
                                </Link>
                            </CardContent>
                            <IconButton
                                onClick={(e) => handleMenuClick(e, t.id)}
                                sx={{ mr: 1, color: '#94a3b8' }}
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Card>
                        <Menu
                            anchorEl={anchorEl}
                            open={selectedTenantId === t.id && Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            PaperProps={{
                                sx: { borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.06)' }
                            }}
                        >
                            <MenuItem
                                onClick={handleDeleteTenant}
                                sx={{ color: '#ef4444', fontSize: '0.8125rem', gap: 1 }}
                            >
                                <DeleteIcon fontSize="small" /> Delete
                            </MenuItem>
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
        </Box>
    );
}

export default User;
