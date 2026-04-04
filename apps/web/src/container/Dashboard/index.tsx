import { useState, useEffect } from 'react';
import { Breadcrumbs, Grid, IconButton, Typography, Link as Links } from '@mui/material';
import { styled } from '@mui/material/styles';
// @ts-ignore
import { Users, Robot, Decks, Conversation } from '../../assets/svg/index';
import style from './style';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chart from './chart/index';
import Dropdown from './date/index';
import API from '../../utils/api';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { DashboardProps, ActiveMessage, Bot, Tenant } from '../../utils/types';


const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#EADAFD',
    color: '#222',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Dashboard({ className }: DashboardProps) {
  const renderChart = (icon: React.ReactNode, label: string, value: number, backgroundColor: string) => (
    <Grid item xs={12} md={role === 'superadmin' ? 3 : 4}>
      <Grid className='chartContainer'>
        <Grid container>
          <Grid className='iconContainer' sx={{ background: backgroundColor }}>
            <IconButton>{icon}</IconButton>
          </Grid>
          <Grid sx={{ pl: 2 }}>
            <Typography variant='body1'>{label}</Typography>
            <Typography variant='h4'>{value}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const [bots, setBots] = useState<Bot[]>([]);
  const [tenant, setTenant] = useState<Tenant[]>([]);
  const [activeBot, setActiveBot] = useState<ActiveMessage[]>([]);
  const [activeSection, setActiveSection] = useState<ActiveMessage[]>([]);
  const [role, setRole] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [lineChartDate, setlineChartDate] = useState<number>(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantResponse = await API.tenants();
        setTenant(tenantResponse.data);
      }
      catch (error) {
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
    const role = sessionStorage.getItem('role');
    setRole(role || '');
  }, []);

  const getUserCountInTenant = (tenantId: string | number): number => {
    let BotCount = 0;
    const NoBots = bots.filter(bot => bot.tenant === tenantId);
    BotCount += NoBots.length;
    return BotCount;
  };

  const countNonRepeatedBots = (data: ActiveMessage[], tenantId: string | number): number => {
    const botIds = new Set<string>();
    data.forEach(message => {
      if (message.bot !== null && message.tenant === tenantId) {
        botIds.add(message.bot);
      }
    });
    return botIds.size;
  };

  const countNonRepeatedUUID = (data: ActiveMessage[], tenantId: string | number): number => {
    const uuIds = new Set<string>();
    data.forEach(message => {
      if (message.local_uuid !== null && message.tenant === tenantId) {
        uuIds.add(message.local_uuid);
      }
    });
    return uuIds.size;
  };

  const countNonRepeatedBotsTotal = (data: ActiveMessage[]): number => {
    const botIds = new Set<string>();
    data.forEach(message => {
      if (message.bot !== null) {
        botIds.add(message.bot);
      }
    });
    return botIds.size;
  };

  const countNonRepeatedUUIDTotal = (data: ActiveMessage[]): number => {
    const uuIds = new Set<string>();
    data.forEach(message => {
      if (message.local_uuid !== null) {
        uuIds.add(message.local_uuid);
      }
    });

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
    return function(a: any, b: any) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0;
      }

      const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  };

  return (
    <Grid className={className}>
      <Grid>
        <Grid item xs={12} sx={{ pb: 1 }}>
          <Breadcrumbs separator="››" aria-label="breadcrumb">
            <Links underline="hover" color="blue" href="/dashboard">
              Home
            </Links>
            <Typography color="text.primary">Dashboard</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12} sx={{ pb: 2 }}>
          <Typography variant='h2' style={{ margin: '0px 10px 0px 0px' }}>Dashboard</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} className={className}>
        {role === 'superadmin' && renderChart(<Users />, 'Total Tenant', tenant.length, 'rgba(4, 57, 39,0.75)')}
        {renderChart(<Robot />, 'Total Bots', bots.length, 'rgba(4, 57, 39,0.75)')}
        {renderChart(<Decks />, 'Total Active Bots', countNonRepeatedBotsTotal(activeBot), 'rgba(4, 57, 39,0.75)')}
        {renderChart(<Conversation />, 'Total Active Sessions', countNonRepeatedUUIDTotal(activeSection), 'rgba(4, 57, 39,0.75)')}
      </Grid>
      <Grid container spacing={3} style={{ marginTop: '20px', justifyContent: 'space-evenly' }}>
        {role === 'superadmin' && (<Grid item md={6} xs={12} className=''>
          <Grid className='dashTable'>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Tenants<SwapVertIcon fontSize='small' onClick={() => handleSort('name')} /></StyledTableCell>
                    <StyledTableCell align="right">Number of Bots</StyledTableCell>
                    <StyledTableCell align="right">Total Active Bots</StyledTableCell>
                    <StyledTableCell align="right">Total Active Sessions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenant.sort(compareValues(sortBy, sortOrder)).map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">{getUserCountInTenant(row.id)}</StyledTableCell>
                      <StyledTableCell align="right">{countNonRepeatedBots(activeBot, row.id)}</StyledTableCell>
                      <StyledTableCell align="right">{countNonRepeatedUUID(activeSection, row.id)}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>)}
        <Grid item md={role === 'superadmin' ? 6 : 8} xs={12} >
          <Grid className='boxContainer'>
            <Dropdown
              setlineChartDate={setlineChartDate} />
            <Chart 
              datas={activeBot}
              botNames={bots}
              lineChartDate={lineChartDate} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default styled(Dashboard)(style);