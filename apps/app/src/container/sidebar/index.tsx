import { useState, useRef } from 'react';
import { Avatar, Box, Divider, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  SquaresFour,
  Robot,
  Plugs,
  ChartBar,
  ChatTeardropDots,
  UsersThree,
  Bell,
  Key,
  CreditCard,
  SignOut,
} from '@phosphor-icons/react';
import Logo from '../../assets/favicon.ico';
import API from '../../utils/api';

// ─── Nav Config ──────────────────────────────────────────────────────────────

const navItems = [
  { label: 'Dashboard',     path: '/dashboard',    Icon: SquaresFour },
  { label: 'Agents',        path: '/agents',        Icon: Robot },
  { label: 'Integrations',  path: '/integrations',  Icon: Plugs },
  { label: 'Analytics',     path: '/analytics',     Icon: ChartBar },
  { label: 'Conversations', path: '/conversations', Icon: ChatTeardropDots },
  { label: 'Team',          path: '/team',          Icon: UsersThree },
  { label: 'Notifications', path: '/notification',  Icon: Bell },
  { label: 'API Keys',      path: '/api-keys',      Icon: Key },
  { label: 'Subscription',  path: '/subscription',  Icon: CreditCard },
];

// ─── Constants ───────────────────────────────────────────────────────────────

const COLLAPSED_W = 64;
const EXPANDED_W  = 224;

// ─── Light palette ───────────────────────────────────────────────────────────
const C = {
  bg:          '#ffffff',
  border:      'rgba(0,0,0,0.08)',
  accent:      '#000000',
  accentLight: 'rgba(0,0,0,0.04)',
  accentMid:   'rgba(0,0,0,0.08)',
  accentText:  '#000000',
  iconIdle:    '#6B7280',     // Gray for idle icons
  iconActive:  '#6B7280',     // Same gray for active icons (no dark color)
  labelIdle:   '#6B7280',     // Gray for idle labels
  labelActive: '#000000',     // Black for active labels only
  userText:    '#1e293b',
  userRole:    '#94a3b8',
  divider:     'rgba(0,0,0,0.06)',
  tooltipBg:   '#1e293b',
  tooltipText: '#e2e8f0',
  shadowIdle:  '2px 0 10px rgba(0,0,0,0.03)',
  shadowHover: '6px 0 28px rgba(0,0,0,0.08)',
};

// ─── Component ───────────────────────────────────────────────────────────────

// Accepts — and intentionally ignores — any props the parent passes
// (collapsed, onToggle, setCollapsed, etc.). This sidebar is self-contained
// and expands/collapses purely on mouse hover.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Sidebar(_props: any) {
  const location = useLocation();
  const [hovered, setHovered]   = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const username = sessionStorage.getItem('username') || 'User';
  const role     = sessionStorage.getItem('role') || 'admin';
  const initials = username.charAt(0).toUpperCase();

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
      <style>{`
        @keyframes sb-slide-in {
          from { opacity: 0; transform: translateX(-7px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          height: '100%',
          pl: '16px',
        }}
      >
        <Box
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            position:      'relative',
            display:       'flex',
            flexDirection: 'column',
            mt:            '16px',
            mb:            '16px',
            width:         collapsed ? COLLAPSED_W : EXPANDED_W,
            minWidth:      collapsed ? COLLAPSED_W : EXPANDED_W,
            maxWidth:      collapsed ? COLLAPSED_W : EXPANDED_W,
            flexShrink:    0,
            transition:    'width 220ms cubic-bezier(0.4,0,0.2,1), min-width 220ms cubic-bezier(0.4,0,0.2,1), max-width 220ms cubic-bezier(0.4,0,0.2,1), box-shadow 220ms ease',
            overflow:      'hidden',
            background:    C.bg,
            borderRadius:  '16px',  // Add border radius like Lyzr
            borderRight:   `1px solid ${C.border}`,
            boxShadow:     hovered ? C.shadowHover : C.shadowIdle,
            py:            2,
            zIndex:        200,
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
              src={Logo}
              alt="saple.ai"
              sx={{
                width:        34,
                height:       34,
                borderRadius: '10px',
                objectFit:    'cover',
                flexShrink:   0,
                boxShadow:    '0 2px 8px rgba(0,0,0,0.1)',
                border:       `1.5px solid ${C.border}`,
              }}
            />
            {!collapsed && (
              <Box sx={{ animation: 'sb-slide-in 180ms ease both', overflow: 'hidden' }}>
                <Typography
                  sx={{
                    fontWeight:           800,
                    fontSize:             '1rem',
                    letterSpacing:        '-0.025em',
                    lineHeight:           1.1,
                    whiteSpace:           'nowrap',
                    color:                '#000000',
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
                        boxShadow:    '0 8px 24px rgba(0,0,0,0.3)',
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
                      position:       'relative',
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
                    {/* Icon — plain span avoids MUI Box forwarding issues with Phosphor SVGs */}
                    <span
                      style={{
                        display:    'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                        marginLeft: '4px',
                        color:      C.iconIdle,  // Always use the same gray color for icons
                        transition: 'color 160ms ease',
                      }}
                    >
                      <Icon size={19} weight={isActive ? 'fill' : 'regular'} />
                    </span>

                    {/* Label */}
                    {!collapsed && (
                      <Typography
                        sx={{
                          color:          isActive ? C.labelActive : C.labelIdle,
                          fontSize:       '0.8125rem',
                          fontWeight:     isActive ? 600 : 400,
                          whiteSpace:     'nowrap',
                          letterSpacing:  '-0.01em',
                          transition:     'color 160ms ease',
                          animation:      'sb-slide-in 180ms ease both',
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
            title={collapsed ? `${username} · ${role}` : ''}
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
                  background: '#000000',
                  fontSize:   '0.8125rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  boxShadow:  '0 2px 8px rgba(0,0,0,0.15)',
                  border:     '1.5px solid rgba(0,0,0,0.1)',
                }}
              >
                {initials}
              </Avatar>

              {!collapsed && (
                <Box
                  sx={{
                    overflow:       'hidden',
                    animation:      'sb-slide-in 180ms ease both',
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
                    {role}
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
                background:   '#ffffff',
                border:       `1px solid ${C.border}`,
                borderRadius: '12px',
                minWidth:     160,
                boxShadow:    '0 12px 40px rgba(0,0,0,0.1)',
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
                color:        '#ef4444',
                fontSize:     '0.8125rem',
                fontWeight:   500,
                borderRadius: '8px',
                py:           1,
                px:           1.5,
                transition:   'background 140ms ease',
                '&:hover': {
                  background: 'rgba(239,68,68,0.07)',
                  color:      '#dc2626',
                },
              }}
            >
              <SignOut size={16} weight="bold" />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </>
  );
}