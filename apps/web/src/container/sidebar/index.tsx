import React, { useState, useRef } from 'react';
import { Avatar, Box, Divider, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import API from '../../utils/api';

// ─── Dark palette ────────────────────────────────────────────────────────────
const C = {
  bg:          '#0f172a',
  border:      'rgba(255,255,255,0.08)',
  accentLight: 'rgba(255,255,255,0.06)',
  accentMid:   'rgba(255,255,255,0.1)',
  iconIdle:    '#94a3b8',
  labelIdle:   '#94a3b8',
  labelActive: '#f1f5f9',
  userText:    '#e2e8f0',
  userRole:    '#64748b',
  divider:     'rgba(255,255,255,0.06)',
  tooltipBg:   '#1e293b',
  tooltipText: '#e2e8f0',
  shadowIdle:  '4px 0 20px rgba(0,0,0,0.3)',
  shadowHover: '8px 0 40px rgba(0,0,0,0.5)',
};

const COLLAPSED_W = 80;
const EXPANDED_W  = 224;

interface NavItem {
  id: string;
  label: string;
  path: string;
  Icon: React.ElementType;
}

const allNavItems: NavItem[] = [
  { id: 'dashboard',   label: 'Dashboard',  path: '/dashboard',   Icon: DashboardOutlinedIcon },
  { id: 'tenant',      label: 'Tenant',      path: '/tenant',       Icon: BusinessOutlinedIcon },
  { id: 'manage',      label: 'Manage',      path: '/manage',       Icon: SettingsOutlinedIcon },
  { id: 'manageadmin', label: 'Manage',      path: '/manageadmin',  Icon: SettingsOutlinedIcon },
  { id: 'superadmin',  label: 'Super Admin', path: '/users',        Icon: AdminPanelSettingsOutlinedIcon },
];

export default function Sidebar() {
  const location                  = useLocation();
  const [hovered, setHovered]     = useState(false);
  const [anchorEl, setAnchorEl]   = useState<null | HTMLElement>(null);
  const timerRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const userRole = sessionStorage.getItem('role') || '';
  const username = sessionStorage.getItem('username') || 'User';
  const initials = username.charAt(0).toUpperCase();

  const navItems = allNavItems.filter(item => {
    if (userRole === 'superadmin') return item.id !== 'manage';
    return item.id !== 'tenant' && item.id !== 'manageadmin';
  });

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHovered(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHovered(false), 150);
  };

  const handleAvatarClick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose   = () => setAnchorEl(null);
  const handleSignOut     = () => { handleMenuClose(); API.logout(); };

  const collapsed = !hovered;

  return (
    <>
      {/* Hide the manual drawer toggle button from the parent layout */}
      <style>{`
        .drawericon { display: none !important; }
        @keyframes sb-web-slide-in {
          from { opacity: 0; transform: translateX(-7px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          position:      'relative',
          height:        '100%',
          zIndex:        1200,
          display:       'flex',
          flexDirection: 'column',
          width:         collapsed ? COLLAPSED_W : EXPANDED_W,
          minWidth:      collapsed ? COLLAPSED_W : EXPANDED_W,
          transition:    'width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1), box-shadow 220ms ease',
          overflow:      'hidden',
          boxSizing:     'border-box',
          background:    C.bg,
          borderRadius:  '16px',
          borderRight:   `1px solid ${C.border}`,
          boxShadow:     hovered ? C.shadowHover : C.shadowIdle,
          py:            2,
        }}
      >
        {/* ── Logo ──────────────────────────────────────────────── */}
        <Box
          sx={{
            display:    'flex',
            alignItems: 'center',
            gap:        1.25,
            px:         collapsed ? '15px' : '16px',
            mb:         3,
            minHeight:  40,
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="/favicon.ico"
            alt="saple.ai"
            sx={{
              width:        34,
              height:       34,
              borderRadius: '10px',
              objectFit:    'cover',
              flexShrink:   0,
              boxShadow:    '0 2px 8px rgba(0,0,0,0.4)',
              border:       `1.5px solid ${C.border}`,
            }}
          />
          {!collapsed && (
            <Box sx={{ animation: 'sb-web-slide-in 180ms ease both', overflow: 'hidden' }}>
              <Typography
                sx={{
                  fontWeight:    800,
                  fontSize:      '1rem',
                  letterSpacing: '-0.025em',
                  lineHeight:    1.1,
                  whiteSpace:    'nowrap',
                  color:         '#f1f5f9',
                }}
              >
                saple.ai
              </Typography>
              <Typography
                sx={{
                  color:         C.userRole,
                  fontSize:      '0.6rem',
                  fontWeight:    600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  whiteSpace:    'nowrap',
                }}
              >
                AI Platform
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Nav Items ─────────────────────────────────────────── */}
        <Box
          sx={{
            flex:          1,
            minHeight:     0,
            display:       'flex',
            flexDirection: 'column',
            gap:           '1px',
            px:            '8px',
            overflowY:     'auto',
            overflowX:     'hidden',
            '&::-webkit-scrollbar': { width: 0 },
          }}
        >
          {navItems.map(({ label, path, Icon }, idx) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <Tooltip
                key={path}
                title={collapsed ? label : ''}
                placement="right"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      background:   C.tooltipBg,
                      color:        C.tooltipText,
                      fontSize:     '0.75rem',
                      fontWeight:   500,
                      borderRadius: '8px',
                      border:       '1px solid rgba(255,255,255,0.08)',
                      boxShadow:    '0 8px 24px rgba(0,0,0,0.4)',
                      px: 1.25,
                      py: 0.5,
                    },
                  },
                  arrow: { sx: { color: C.tooltipBg } },
                }}
              >
                <Box
                  component={Link}
                  to={path}
                  sx={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            1.25,
                    px:             '10px',
                    py:             '8px',
                    borderRadius:   '10px',
                    textDecoration: 'none',
                    cursor:         'pointer',
                    overflow:       'hidden',
                    background:     isActive ? C.accentMid : 'transparent',
                    border:         isActive ? `1px solid ${C.border}` : '1px solid transparent',
                    transition:     'background 160ms ease, border 160ms ease, transform 120ms ease',
                    '&:hover': {
                      background: isActive ? C.accentMid : C.accentLight,
                      transform:  'translateX(1px)',
                    },
                    '&:active': { transform: 'scale(0.98)' },
                  }}
                >
                  <Icon
                    sx={{
                      fontSize:   collapsed ? 24 : 20,
                      flexShrink: 0,
                      ml:         '4px',
                      color:      isActive ? '#f1f5f9' : C.iconIdle,
                      transition: 'color 160ms ease, font-size 220ms ease',
                    }}
                  />
                  {!collapsed && (
                    <Typography
                      sx={{
                        color:          isActive ? C.labelActive : C.labelIdle,
                        fontSize:       '0.9375rem',
                        fontWeight:     isActive ? 600 : 400,
                        whiteSpace:     'nowrap',
                        letterSpacing:  '-0.01em',
                        transition:     'color 160ms ease',
                        animation:      'sb-web-slide-in 180ms ease both',
                        animationDelay: `${idx * 15}ms`,
                      }}
                    >
                      {label}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* ── Divider ───────────────────────────────────────────── */}
        <Divider sx={{ borderColor: C.divider, mx: '12px', my: 1.5, flexShrink: 0 }} />

        {/* ── User Section ──────────────────────────────────────── */}
        <Tooltip
          title={collapsed ? username : ''}
          placement="right"
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                background:   C.tooltipBg,
                color:        C.tooltipText,
                fontSize:     '0.75rem',
                borderRadius: '8px',
                border:       '1px solid rgba(255,255,255,0.08)',
              },
            },
            arrow: { sx: { color: C.tooltipBg } },
          }}
        >
          <Box
            onClick={handleAvatarClick}
            sx={{
              display:      'flex',
              alignItems:   'center',
              gap:          1.25,
              px:           collapsed ? '8px' : '12px',
              py:           '9px',
              mx:           collapsed ? '4px' : '8px',
              borderRadius: '10px',
              cursor:       'pointer',
              flexShrink:   0,
              border:       '1px solid transparent',
              transition:   'background 160ms ease, border 160ms ease, padding 220ms cubic-bezier(0.4,0,0.2,1), margin 220ms cubic-bezier(0.4,0,0.2,1)',
              '&:hover': {
                background: C.accentLight,
                border:     `1px solid ${C.border}`,
              },
            }}
          >
            <Avatar
              sx={{
                width:      32,
                height:     32,
                background: '#334155',
                fontSize:   '0.8125rem',
                fontWeight: 700,
                flexShrink: 0,
                boxShadow:  '0 2px 8px rgba(0,0,0,0.3)',
                border:     `1.5px solid ${C.border}`,
              }}
            >
              {initials}
            </Avatar>
            {!collapsed && (
              <Box
                sx={{
                  overflow:       'hidden',
                  animation:      'sb-web-slide-in 180ms ease both',
                  animationDelay: '30ms',
                }}
              >
                <Typography
                  sx={{
                    color:         C.userText,
                    fontSize:      '0.8125rem',
                    fontWeight:    600,
                    letterSpacing: '-0.01em',
                    whiteSpace:    'nowrap',
                    overflow:      'hidden',
                    textOverflow:  'ellipsis',
                  }}
                >
                  {username}
                </Typography>
                <Typography
                  sx={{
                    color:         C.userRole,
                    fontSize:      '0.6875rem',
                    textTransform: 'capitalize',
                    letterSpacing: '0.02em',
                    whiteSpace:    'nowrap',
                  }}
                >
                  {userRole}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>

        {/* ── Sign Out Menu ─────────────────────────────────────── */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          PaperProps={{
            sx: {
              background:   '#1e293b',
              border:       `1px solid ${C.border}`,
              borderRadius: '12px',
              minWidth:     160,
              boxShadow:    '0 12px 40px rgba(0,0,0,0.4)',
              overflow:     'hidden',
              p:            '4px',
            },
          }}
        >
          <MenuItem
            onClick={handleSignOut}
            sx={{
              display:      'flex',
              alignItems:   'center',
              gap:          1.25,
              color:        '#f87171',
              fontSize:     '0.8125rem',
              fontWeight:   500,
              borderRadius: '8px',
              py:           1,
              px:           1.5,
              transition:   'background 140ms ease',
              '&:hover': {
                background: 'rgba(239,68,68,0.15)',
                color:      '#fca5a5',
              },
            }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
            Sign Out
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
