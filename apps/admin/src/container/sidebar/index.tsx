import { useRef, useState } from 'react';
import { Avatar, Box, Divider, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import API from '../../utils/api';
import Logo from '../../../../app/src/assets/favicon.ico';

const C = {
  bg: '#1e1b4b',
  border: 'rgba(255,255,255,0.12)',
  accentLight: 'rgba(167,139,250,0.14)',
  accentMid: 'rgba(167,139,250,0.2)',
  iconIdle: '#c4b5fd',
  labelIdle: '#ddd6fe',
  labelActive: '#ffffff',
  userText: '#f5f3ff',
  userRole: '#c4b5fd',
  divider: 'rgba(255,255,255,0.12)',
  tooltipBg: '#312e81',
  tooltipText: '#f5f3ff',
  shadowIdle: '2px 0 16px rgba(30,27,75,0.25)',
  shadowHover: '8px 0 30px rgba(30,27,75,0.4)',
};

const COLLAPSED_W = 80;
const EXPANDED_W = 224;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', Icon: DashboardOutlinedIcon },
  { label: 'Tenants', path: '/tenant', Icon: BusinessOutlinedIcon },
  { label: 'Users', path: '/users', Icon: AdminPanelSettingsOutlinedIcon },
  { label: 'Notifications', path: '/notification', Icon: NotificationsNoneOutlinedIcon },
];

export default function Sidebar() {
  const location = useLocation();
  const [hovered, setHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const username = sessionStorage.getItem('username') || 'Admin';
  const role = sessionStorage.getItem('role') || 'superadmin';
  const initials = username.charAt(0).toUpperCase();

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHovered(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHovered(false), 150);
  };

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSignOut = () => { handleMenuClose(); API.logout(); };

  const collapsed = !hovered;

  return (
    <>
      <style>{`
        .drawericon { display: none !important; }
        @keyframes sb-admin-slide-in {
          from { opacity: 0; transform: translateX(-7px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          position: 'relative',
          height: '100%',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          width: collapsed ? COLLAPSED_W : EXPANDED_W,
          minWidth: collapsed ? COLLAPSED_W : EXPANDED_W,
          transition: 'width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1), box-shadow 220ms ease',
          overflow: 'hidden',
          boxSizing: 'border-box',
          background: C.bg,
          borderRadius: '16px',
          border: `1px solid ${C.border}`,
          boxShadow: hovered ? C.shadowHover : C.shadowIdle,
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: collapsed ? '15px' : '16px', mb: 3, minHeight: 40, flexShrink: 0 }}>
          <Box component="img" src={Logo} alt="saple.ai" sx={{ width: 34, height: 34, borderRadius: '10px', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${C.border}` }} />
          {!collapsed && (
            <Box sx={{ animation: 'sb-admin-slide-in 180ms ease both', overflow: 'hidden' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.025em', lineHeight: 1.1, whiteSpace: 'nowrap', color: '#fff' }}>
                saple.ai
              </Typography>
              <Typography sx={{ color: C.userRole, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                AI Platform
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '1px', px: '8px', overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': { width: 0 } }}>
          {navItems.map(({ label, path, Icon }, idx) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Tooltip key={path} title={collapsed ? label : ''} placement="right" arrow componentsProps={{ tooltip: { sx: { background: C.tooltipBg, color: C.tooltipText, fontSize: '0.75rem', fontWeight: 500, borderRadius: '8px', border: `1px solid ${C.border}` } }, arrow: { sx: { color: C.tooltipBg } } }}>
                <Box
                  component={Link}
                  to={path}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: '10px',
                    py: '8px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: isActive ? C.accentMid : 'transparent',
                    border: isActive ? `1px solid ${C.border}` : '1px solid transparent',
                    transition: 'background 160ms ease, border 160ms ease, transform 120ms ease',
                    '&:hover': { background: isActive ? C.accentMid : C.accentLight, transform: 'translateX(1px)' },
                  }}
                >
                  <Icon sx={{ fontSize: collapsed ? 24 : 20, flexShrink: 0, ml: '4px', color: isActive ? '#fff' : C.iconIdle }} />
                  {!collapsed && (
                    <Typography sx={{ color: isActive ? C.labelActive : C.labelIdle, fontSize: '0.9375rem', fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', letterSpacing: '-0.01em', animation: 'sb-admin-slide-in 180ms ease both', animationDelay: `${idx * 15}ms` }}>
                      {label}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        <Divider sx={{ borderColor: C.divider, mx: '12px', my: 1.5, flexShrink: 0 }} />

        <Tooltip title={collapsed ? `${username} · ${role}` : ''} placement="right" arrow componentsProps={{ tooltip: { sx: { background: C.tooltipBg, color: C.tooltipText, fontSize: '0.75rem', borderRadius: '8px', border: `1px solid ${C.border}` } }, arrow: { sx: { color: C.tooltipBg } } }}>
          <Box
            onClick={handleAvatarClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              px: collapsed ? '8px' : '12px',
              py: '9px',
              mx: collapsed ? '4px' : '8px',
              borderRadius: '10px',
              cursor: 'pointer',
              flexShrink: 0,
              border: '1px solid transparent',
              '&:hover': { background: C.accentLight, border: `1px solid ${C.border}` },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, background: '#4c1d95', fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0, border: `1.5px solid ${C.border}` }}>
              {initials}
            </Avatar>
            {!collapsed && (
              <Box sx={{ overflow: 'hidden', animation: 'sb-admin-slide-in 180ms ease both', animationDelay: '30ms' }}>
                <Typography sx={{ color: C.userText, fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {username}
                </Typography>
                <Typography sx={{ color: C.userRole, fontSize: '0.6875rem', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                  {role}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{ sx: { background: '#312e81', border: `1px solid ${C.border}`, borderRadius: '12px', minWidth: 160, p: '4px' } }}
        >
          <MenuItem onClick={handleSignOut} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: '#fda4af', fontSize: '0.8125rem', fontWeight: 500, borderRadius: '8px' }}>
            <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
            Sign Out
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
