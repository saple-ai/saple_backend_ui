import { useEffect, useState, useCallback } from 'react';
import EmptyState from '../../components/EmptyState';
import {
  Grid, Typography, Paper, Box, MenuItem, Select,
  FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Breadcrumbs, Link as Links, SelectChangeEvent,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, InputAdornment, Divider, Tooltip, IconButton,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import API from '../../utils/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Bot { id: number | string; name: string }

interface Session {
  session_id: string;
  customer: string;
  message_count: number;
  started_at: string | null;
  last_message_at: string | null;
  topics: string[];
  escalated: boolean;
  resolved: boolean | null;
}

interface MessageAnalysis {
  intent: string | null;
  sentiment: number | null;
  topics: string[];
  tools_used: string[];
  escalated: boolean;
  escalation_reason: string;
  response_time_ms: number | null;
}

interface ConvMessage {
  id: number;
  content: string;
  sender: string;
  timestamp: string;
  analysis: MessageAnalysis | null;
}

interface ConversationDetail {
  session_id: string;
  customer: string;
  message_count: number;
  messages: ConvMessage[];
}

// ── Styled ────────────────────────────────────────────────────────────────────

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: { backgroundColor: '#f1f5f9', color: '#222' },
}));

// ── Sentiment badge ───────────────────────────────────────────────────────────

function SentimentDot({ value }: { value: number | null }) {
  if (value === null) return null;
  const color = value > 0.2 ? '#4CAF50' : value < -0.2 ? '#F44336' : '#FF9800';
  return (
    <Tooltip title={`Sentiment: ${value.toFixed(2)}`}>
      <Box
        sx={{
          width: 8, height: 8, borderRadius: '50%',
          background: color, display: 'inline-block', ml: 0.5,
        }}
      />
    </Tooltip>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: ConvMessage }) {
  const isUser = msg.sender === 'user';
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1.5,
        gap: 1,
        alignItems: 'flex-end',
      }}
    >
      {!isUser && (
        <Avatar sx={{ width: 28, height: 28, background: '#7C4DFF', fontSize: 13 }}>
          <SmartToyOutlinedIcon sx={{ fontSize: 16 }} />
        </Avatar>
      )}
      <Box sx={{ maxWidth: '72%' }}>
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            background: isUser ? '#6366f1' : '#F1F5F9',
            color: isUser ? '#fff' : '#1e293b',
            fontSize: 13.5,
            lineHeight: 1.55,
            wordBreak: 'break-word',
          }}
        >
          {msg.content}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.25,
            justifyContent: isUser ? 'flex-end' : 'flex-start',
          }}
        >
          <Typography fontSize={10} color="text.disabled">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
          {msg.analysis && <SentimentDot value={msg.analysis.sentiment} />}
          {msg.analysis?.escalated && (
            <Tooltip title={msg.analysis.escalation_reason || 'Escalated'}>
              <WarningAmberIcon sx={{ fontSize: 12, color: '#FF9800' }} />
            </Tooltip>
          )}
          {(msg.analysis?.tools_used?.length ?? 0) > 0 && (
            <Tooltip title={`Tools: ${msg.analysis?.tools_used?.join(', ')}`}>
              <Chip label="API" size="small" sx={{ height: 14, fontSize: 9, px: 0.2 }} />
            </Tooltip>
          )}
        </Box>
      </Box>
      {isUser && (
        <Avatar sx={{ width: 28, height: 28, background: '#94A3B8', fontSize: 13 }}>
          <PersonOutlineIcon sx={{ fontSize: 16 }} />
        </Avatar>
      )}
    </Box>
  );
}

// ── Conversation detail dialog ─────────────────────────────────────────────────

function ConversationDetailDialog({
  sessionId,
  onClose,
}: {
  sessionId: string | null;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) { setDetail(null); return; }
    setLoading(true);
    API.conversationDetail(sessionId)
      .then((res) => setDetail(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <Dialog open={!!sessionId} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <span>Conversation</span>
          {detail && (
            <Typography variant="body2" color="text.secondary">
              {detail.customer !== 'Anonymous' ? detail.customer : 'Anonymous user'}
              &nbsp;·&nbsp;{detail.message_count} messages
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress size={28} />
          </Box>
        )}
        {!loading && detail && (
          <Box sx={{ p: 2, maxHeight: 500, overflowY: 'auto' }}>
            {/* Date header */}
            {detail.messages.length > 0 && (
              <Box textAlign="center" mb={2}>
                <Typography fontSize={11} color="text.disabled">
                  {new Date(detail.messages[0].timestamp).toLocaleDateString([], {
                    weekday: 'long', month: 'long', day: 'numeric',
                  })}
                </Typography>
              </Box>
            )}
            {detail.messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function Conversations({ className }: { className?: string }) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [days, setDays] = useState<string>('30');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const PAGE_SIZE = 25;

  useEffect(() => {
    API.bots().then((res) => {
      const list: Bot[] = res.data;
      setBots(list);
      if (list.length > 0) setSelectedBot(String(list[0].id));
    }).catch(console.error);
  }, []);

  const fetchSessions = useCallback(() => {
    if (!selectedBot) return;
    setLoading(true);
    API.conversationList(selectedBot, days, page, search)
      .then((res) => {
        setSessions(res.data.sessions);
        setTotal(res.data.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedBot, days, page, search]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [selectedBot, days, search]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Grid className={className} sx={{ p: 0 }}>
      {/* Header */}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h1">Conversations</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5} sx={{ fontSize: '1rem' }}>
            Browse all bot conversations
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search by email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Agent</InputLabel>
            <Select
              value={selectedBot}
              label="Agent"
              onChange={(e: SelectChangeEvent) => setSelectedBot(e.target.value)}
            >
              {bots.map((b) => (
                <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={days}
              label="Period"
              onChange={(e: SelectChangeEvent) => setDays(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Customer</StyledTableCell>
                <StyledTableCell>Topics</StyledTableCell>
                <StyledTableCell align="center">Messages</StyledTableCell>
                <StyledTableCell>Started</StyledTableCell>
                <StyledTableCell>Last Active</StyledTableCell>
                <StyledTableCell align="center">Escalated</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ border: 0 }}>
                    <EmptyState title="No conversations found" description="Conversations will appear here once users start chatting with your bots." />
                  </TableCell>
                </TableRow>
              ) : sessions.map((session, i) => {
                const isEmail = session.customer.includes('@');
                return (
                  <TableRow
                    key={i}
                    hover
                    onClick={() => setSelectedSession(session.session_id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          sx={{
                            width: 28, height: 28, fontSize: 11,
                            background: isEmail ? '#6366f1' : '#94A3B8',
                          }}
                        >
                          {isEmail ? session.customer.charAt(0).toUpperCase() : '?'}
                        </Avatar>
                        <Typography fontSize={13} fontWeight={isEmail ? 600 : 400} color={isEmail ? 'text.primary' : 'text.secondary'}>
                          {session.customer}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>
                      <Box display="flex" gap={0.4} flexWrap="wrap">
                        {session.topics.slice(0, 3).map((t) => (
                          <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                        ))}
                        {session.topics.length > 3 && (
                          <Chip label={`+${session.topics.length - 3}`} size="small" sx={{ fontSize: 10 }} />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontSize={13}>{session.message_count}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, whiteSpace: 'nowrap', color: 'text.secondary' }}>
                      {session.started_at
                        ? new Date(session.started_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, whiteSpace: 'nowrap', color: 'text.secondary' }}>
                      {session.last_message_at
                        ? new Date(session.last_message_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </TableCell>
                    <TableCell align="center">
                      {session.escalated ? (
                        <WarningAmberIcon sx={{ fontSize: 18, color: '#FF9800' }} />
                      ) : (
                        <Typography fontSize={12} color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {session.resolved === null ? (
                        <Typography fontSize={12} color="text.disabled">—</Typography>
                      ) : (
                        <Chip
                          label={session.resolved ? 'Resolved' : 'Open'}
                          size="small"
                          color={session.resolved ? 'success' : 'warning'}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <>
            <Divider />
            <Box display="flex" alignItems="center" justifyContent="flex-end" px={2} py={1} gap={1}>
              <Typography fontSize={12} color="text.secondary">
                {total} conversations · Page {page} of {totalPages}
              </Typography>
              <IconButton size="small" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        )}
      </Paper>

      {/* Detail dialog */}
      <ConversationDetailDialog
        sessionId={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </Grid>
  );
}

export default styled(Conversations)(() => ({
  padding: '16px 24px',
  '& .MuiPaper-root': { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
}));
