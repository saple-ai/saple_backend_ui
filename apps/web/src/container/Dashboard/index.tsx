import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import API from '../../utils/api';
import { DashboardProps, ActiveMessage, Bot, Tenant } from '../../utils/types';
import Chart from './chart/index';
import Dropdown from './date/index';

function Dashboard(_props: DashboardProps) {
  const [bots, setBots]                 = useState<Bot[]>([]);
  const [tenant, setTenant]             = useState<Tenant[]>([]);
  const [activeBot, setActiveBot]       = useState<ActiveMessage[]>([]);
  const [activeSection, setActiveSection] = useState<ActiveMessage[]>([]);
  const [role, setRole]                 = useState<string>('');
  const [sortBy, setSortBy]             = useState<string>('');
  const [sortOrder, setSortOrder]       = useState<'asc' | 'desc'>('asc');
  const [lineChartDate, setlineChartDate] = useState<number>(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantResponse = await API.tenants();
        setTenant(tenantResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.bots();
        setBots(response.data);
        const activebot = await API.activebot();
        setActiveBot(activebot.data);
        const activesection = await API.activesection();
        setActiveSection(activesection.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    const storedRole = sessionStorage.getItem('role');
    setRole(storedRole || '');
  }, []);

  const getUserCountInTenant = (tenantId: string | number): number => {
    return bots.filter((bot) => bot.tenant === tenantId).length;
  };

  const countNonRepeatedBots = (data: ActiveMessage[], tenantId: string | number): number => {
    const botIds = new Set<string>();
    data.forEach((message) => {
      if (message.bot !== null && message.tenant === tenantId) botIds.add(message.bot);
    });
    return botIds.size;
  };

  const countNonRepeatedUUID = (data: ActiveMessage[], tenantId: string | number): number => {
    const uuIds = new Set<string>();
    data.forEach((message) => {
      if (message.local_uuid !== null && message.tenant === tenantId) uuIds.add(message.local_uuid);
    });
    return uuIds.size;
  };

  const countNonRepeatedBotsTotal = (data: ActiveMessage[]): number => {
    const botIds = new Set<string>();
    data.forEach((message) => { if (message.bot !== null) botIds.add(message.bot); });
    return botIds.size;
  };

  const countNonRepeatedUUIDTotal = (data: ActiveMessage[]): number => {
    const uuIds = new Set<string>();
    data.forEach((message) => { if (message.local_uuid !== null) uuIds.add(message.local_uuid); });
    return uuIds.size;
  };

  const handleSort = (field: string): void => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const compareValues = (key: string, order: 'asc' | 'desc' = 'asc') => {
    return function (a: any, b: any) {
      if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) return 0;
      const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) comparison = 1;
      else if (varA < varB) comparison = -1;
      return order === 'desc' ? comparison * -1 : comparison;
    };
  };

  const iconColor = '#6B7280';

  const kpiCards = [
    ...(role === 'superadmin'
      ? [{ label: 'Total Tenants',   value: tenant.length,                        Icon: WorkOutlinedIcon }]
      : []),
    { label: 'Total Bots',           value: bots.length,                          Icon: SmartToyOutlinedIcon },
    { label: 'Active Bots',          value: countNonRepeatedBotsTotal(activeBot),  Icon: FavoriteBorderOutlinedIcon },
    { label: 'Active Sessions',      value: countNonRepeatedUUIDTotal(activeSection), Icon: ChatBubbleOutlineOutlinedIcon },
  ];

  const cardShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)';

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" sx={{ fontWeight: 700, color: '#0f172a' }}>
          Dashboard
        </Typography>
      </Box>

      {/* KPI cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {kpiCards.map(({ label, value, Icon }) => (
          <Grid item xs={12} sm={6} md={role === 'superadmin' ? 3 : 4} key={label}>
            <Card elevation={0} sx={{ borderRadius: '16px', boxShadow: cardShadow, border: '1px solid rgba(0,0,0,0.04)' }}>
              <CardContent sx={{ p: '20px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Icon sx={{ fontSize: 22, flexShrink: 0, mt: '2px', color: iconColor }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 0.25, fontSize: '0.8125rem' }}>
                      {label}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1, fontSize: '1.75rem' }}>
                      {value}
                    </Typography>
                    <Typography sx={{ fontSize: '0.6875rem', color: '#94a3b8', mt: 0.5 }}>
                      this period
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom section: table + chart */}
      <Grid container spacing={2.5}>
        {role === 'superadmin' && (
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: '16px', boxShadow: cardShadow, border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f1f5f9' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#0f172a' }}>
                  Tenants Overview
                </Typography>
              </Box>
              <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 380 }}>
                <Table stickyHeader size="small" aria-label="tenants table">
                  <TableHead>
                    <TableRow>
                      {['Tenant', 'Bots', 'Active Bots', 'Sessions'].map((header, i) => (
                        <TableCell
                          key={header}
                          align={i === 0 ? 'left' : 'right'}
                          sx={{ background: '#f1f5f9', color: '#475569', fontWeight: 600, fontSize: '0.75rem', borderBottom: '1px solid #e2e8f0' }}
                        >
                          {i === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              Tenant
                              <IconButton size="small" onClick={() => handleSort('name')} sx={{ p: 0.25 }}>
                                <SwapVertIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                              </IconButton>
                            </Box>
                          ) : header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenant.sort(compareValues(sortBy, sortOrder)).map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:nth-of-type(odd)': { background: '#fafafa' }, '&:last-child td': { border: 0 }, '&:hover': { background: '#f8faff' } }}
                      >
                        <TableCell sx={{ fontSize: '0.8125rem', color: '#0f172a', fontWeight: 500 }}>{row.name}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.8125rem', color: '#475569' }}>{getUserCountInTenant(row.id)}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.8125rem', color: '#475569' }}>{countNonRepeatedBots(activeBot, row.id)}</TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.8125rem', color: '#475569' }}>{countNonRepeatedUUID(activeSection, row.id)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} md={role === 'superadmin' ? 6 : 12}>
          <Card elevation={0} sx={{ borderRadius: '16px', boxShadow: cardShadow, border: '1px solid rgba(0,0,0,0.04)' }}>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#0f172a' }}>
                Activity
              </Typography>
              <Dropdown setlineChartDate={setlineChartDate} />
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart datas={activeBot} botNames={bots} lineChartDate={lineChartDate} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
