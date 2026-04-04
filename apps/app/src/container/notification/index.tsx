import { useState } from 'react';
import { Box, Typography, Chip, Divider, Button, Avatar } from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';

type NotificationType = 'escalation' | 'success' | 'warning' | 'info';

interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

const SAMPLE: NotificationItem[] = [
  {
    id: 1,
    type: 'escalation',
    title: 'Escalation triggered',
    desc: 'Session #A1B2 escalated to human agent — sentiment dropped below threshold.',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'success',
    title: 'Bot training complete',
    desc: 'Customer Support Bot successfully trained on 24 new documents.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'New API key created',
    desc: 'A new API key "Production Widget" was created for your tenant.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'warning',
    title: 'Usage limit approaching',
    desc: 'You have used 89% of your monthly message quota (4,450 / 5,000).',
    time: '5 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'escalation',
    title: 'Escalation resolved',
    desc: 'Ticket #ZD-4521 has been marked as resolved by the support team.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 6,
    type: 'success',
    title: 'WhatsApp integration connected',
    desc: 'Your WhatsApp Business API account has been successfully linked.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 7,
    type: 'info',
    title: 'Subscription renewed',
    desc: 'Your Starter plan has been renewed for another billing period.',
    time: '3 days ago',
    read: true,
  },
];

const typeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  escalation: {
    icon: <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />,
    color: '#dc2626',
    bg: '#fee2e2',
  },
  success: {
    icon: <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />,
    color: '#059669',
    bg: '#d1fae5',
  },
  warning: {
    icon: <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />,
    color: '#d97706',
    bg: '#fef3c7',
  },
  info: {
    icon: <InfoOutlinedIcon sx={{ fontSize: 18 }} />,
    color: '#2563eb',
    bg: '#dbeafe',
  },
};

type FilterTab = 'all' | 'unread' | 'escalations';

export default function Notifications() {
  const [items, setItems] = useState<NotificationItem[]>(SAMPLE);
  const [filter, setFilter] = useState<FilterTab>('all');

  const unreadCount = items.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkRead = (id: number) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredItems = items.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'escalations') return n.type === 'escalation';
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'escalations', label: 'Escalations' },
  ];

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.375rem' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={unreadCount}
              size="small"
              sx={{
                background: '#6366f1',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.75rem',
                height: 22,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            startIcon={<DoneAllIcon sx={{ fontSize: 16 }} />}
            size="small"
            sx={{
              color: '#6366f1',
              fontSize: '0.8125rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { background: 'rgba(99,102,241,0.06)' },
            }}
          >
            Mark all read
          </Button>
        )}
      </Box>

      {/* Card container */}
      <Box
        sx={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Filter tabs */}
        <Box sx={{ display: 'flex', gap: 0, px: 2, pt: 1.5, borderBottom: '1px solid #f1f5f9' }}>
          {tabs.map((tab) => (
            <Box
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              sx={{
                px: 2,
                py: 1.25,
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: filter === tab.key ? 600 : 400,
                color: filter === tab.key ? '#6366f1' : '#64748b',
                borderBottom: filter === tab.key ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 0.15s ease',
                '&:hover': { color: '#6366f1' },
              }}
            >
              {tab.label}
            </Box>
          ))}
        </Box>

        {/* Notification list */}
        {filteredItems.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 28, color: '#94a3b8' }} />
            </Box>
            <Typography sx={{ color: '#64748b', fontSize: '0.9375rem', fontWeight: 500 }}>
              No notifications here
            </Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
              {filter === 'unread' ? 'You are all caught up!' : 'Nothing to show for this filter.'}
            </Typography>
          </Box>
        ) : (
          filteredItems.map((item, index) => {
            const config = typeConfig[item.type];
            return (
              <Box key={item.id}>
                <Box
                  onClick={() => handleMarkRead(item.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    px: 2.5,
                    py: 2,
                    cursor: 'pointer',
                    background: item.read ? 'transparent' : '#f8faff',
                    borderLeft: item.read ? '3px solid transparent' : '3px solid #6366f1',
                    transition: 'background 0.15s ease',
                    '&:hover': {
                      background: item.read ? '#fafafa' : '#f0f4ff',
                    },
                  }}
                >
                  {/* Icon avatar */}
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: config.bg,
                      color: config.color,
                      borderRadius: '12px',
                      flexShrink: 0,
                    }}
                  >
                    {config.icon}
                  </Avatar>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.25 }}>
                      <Typography
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: item.read ? 500 : 700,
                          color: '#0f172a',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.6875rem',
                          color: '#94a3b8',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {item.time}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        color: '#64748b',
                        lineHeight: 1.5,
                      }}
                    >
                      {item.desc}
                    </Typography>
                  </Box>

                  {/* Unread dot */}
                  {!item.read && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#6366f1',
                        flexShrink: 0,
                        mt: 0.75,
                      }}
                    />
                  )}
                </Box>
                {index < filteredItems.length - 1 && (
                  <Divider sx={{ borderColor: '#f1f5f9', mx: 2.5 }} />
                )}
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}
