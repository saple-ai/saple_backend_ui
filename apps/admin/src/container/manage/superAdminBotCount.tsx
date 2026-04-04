import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Breadcrumbs, Link as Links, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import API from '../../utils/api';
import style from './style';
import { Tenant, Bot } from '../../utils/types';

interface UserProps {
    className?: string;
}

const User: React.FC<UserProps> = (props) => {
    const { className } = props;
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

    const getUserCountInTenant = (tenantId: string | number): number => {
        let BotCount = 0;
        const NoBots = bots.filter(bot => bot.tenant === tenantId as unknown as number);
        BotCount += NoBots.length;
        return BotCount;
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
                                <Typography color="text.primary">Manage</Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item xs={12} sx={{ pb: 2 }}>
                            <Typography variant='h2' style={{ margin: '0px 10px 0px 0px' }}>Manage</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3} className='container' sx={{ pb: 2 }}>
                {tenant.map((tenant) => (
                    <Grid key={tenant.id} item xs={12} md={4} sx={{ '.MuiPaper-root': { boxShadow: '0px 4px 10px #0000000F' } }}>
                        <Link to={`/manageadmin/bot/${tenant.id}`} style={{ textDecoration: 'none' }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" sx={{ fontWeight: 600, pb: 1 }}>
                                        {tenant.name.toUpperCase()}
                                    </Typography>
                                    <Typography variant='body1'>Bot Count: {getUserCountInTenant(tenant.id)}</Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};

export default styled(User)(style);