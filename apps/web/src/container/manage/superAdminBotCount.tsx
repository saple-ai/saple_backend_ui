import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import API from '../../utils/api';
import { Tenant, Bot } from '../../utils/types';

const cardShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)';

const User: React.FC = () => {
    const [bots, setBots] = useState<Bot[]>([]);
    const [tenant, setTenant] = useState<Tenant[]>([]);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const tenantResponse = await API.tenants();
                setTenant(tenantResponse.data);
                const response = await API.bots();
                setBots(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const getUserCountInTenant = (tenantId: string | number): number =>
        bots.filter((bot) => bot.tenant === tenantId as unknown as number).length;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    Manage
                </Typography>
            </Box>

            {/* Tenant cards */}
            <Grid container spacing={2.5}>
                {tenant.map((t) => (
                    <Grid key={t.id} item xs={12} md={4}>
                        <Link to={`/manageadmin/bot/${t.id}`} style={{ textDecoration: 'none' }}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: '16px',
                                    boxShadow: cardShadow,
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 160ms ease, transform 160ms ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: '20px !important' }}>
                                    <Typography
                                        sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0f172a', mb: 0.5 }}
                                    >
                                        {t.name.toUpperCase()}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8125rem', color: '#64748b' }}>
                                        Bot Count: {getUserCountInTenant(t.id)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default User;
