import React, { useEffect, useRef, useState, useMemo } from 'react';
import EmptyState from '../../components/EmptyState';
import * as d3 from 'd3';
import {
  Grid, Typography, Paper, Box, MenuItem, Select,
  FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Breadcrumbs, Link as Links, SelectChangeEvent,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Divider, Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { LineChart } from '@mui/x-charts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import API from '../../utils/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface KPIs {
  total_conversations: number;
  total_escalations: number;
  unique_customers: number;
  escalation_rate: number;
  resolution_rate: number;
  avg_sentiment: number;
}

interface DayCount { date: string; count: number }
interface SentimentPoint { date: string; avg_sentiment: number }
interface TopTopic { topic: string; count: number }
interface EscalationRow {
  session_id: string;
  customer: string;
  reason: string;
  zendesk_ticket_id: string | null;
  slack_notified: boolean;
  resolved: boolean;
  created_at: string;
  conversation_snippet: string;
  summary: string;
  summary_topics: string[];
}
interface AnalyticsData {
  kpis: KPIs;
  conversations_by_day: DayCount[];
  sentiment_trend: SentimentPoint[];
  top_topics: TopTopic[];
  recent_escalations: EscalationRow[];
}

interface Bot { id: number | string; name: string }

// ── Styled cells ──────────────────────────────────────────────────────────────

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: { backgroundColor: '#EADAFD', color: '#222' },
}));

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({
  icon, label, value, color,
}: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <Paper sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ background: color, borderRadius: '50%', p: 1, display: 'flex' }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

// ── Topics Treemap ────────────────────────────────────────────────────────────

const TREEMAP_COLORS = [
  '#26A69A', '#00897B', '#2E7D32', '#1565C0', '#6A1B9A',
  '#AD1457', '#E65100', '#4527A0', '#00838F', '#37474F',
];

function TopicsTreemap({ topics }: { topics: TopTopic[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);
  const height = 240;

  useEffect(() => {
    if (!containerRef.current) return;
    setWidth(containerRef.current.offsetWidth || 360);
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const leaves = useMemo(() => {
    if (!topics.length || width < 10) return [];
    const root = d3
      .hierarchy<any>({ name: 'root', children: topics })
      .sum((d) => d.count || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));
    d3.treemap<any>().size([width, height]).padding(3).round(true)(root);
    return root.leaves();
  }, [topics, width]);

  if (!topics.length) {
    return (
      <Box py={4} textAlign="center">
        <Typography color="text.secondary">No topics yet</Typography>
      </Box>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        {leaves.map((leaf: any, i: number) => {
          const w = leaf.x1 - leaf.x0;
          const h = leaf.y1 - leaf.y0;
          const color = TREEMAP_COLORS[i % TREEMAP_COLORS.length];
          const label = (leaf.data.topic as string).toUpperCase();
          const count = leaf.value as number;
          const showLabel = w > 38 && h > 20;
          const showCount = w > 38 && h > 38;
          const fontSize = Math.min(13, Math.max(9, w / 8));
          return (
            <Tooltip key={i} title={`${leaf.data.topic}: ${count} mentions`} arrow>
              <g transform={`translate(${leaf.x0},${leaf.y0})`} style={{ cursor: 'default' }}>
                <rect width={w} height={h} fill={color} rx={5} />
                {showLabel && (
                  <text
                    x={w / 2} y={showCount ? h / 2 - 7 : h / 2}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={fontSize} fill="white" fontWeight={700}
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                  >
                    {label.length > 14 ? label.slice(0, 13) + '…' : label}
                  </text>
                )}
                {showCount && (
                  <text
                    x={w / 2} y={h / 2 + 9}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={Math.min(11, fontSize - 1)} fill="rgba(255,255,255,0.80)"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                  >
                    {count}
                  </text>
                )}
              </g>
            </Tooltip>
          );
        })}
      </svg>
    </div>
  );
}

// ── Escalation detail dialog ───────────────────────────────────────────────────

function EscalationDialog({
  row,
  onClose,
}: {
  row: EscalationRow | null;
  onClose: () => void;
}) {
  if (!row) return null;

  const snippetLines = (row.conversation_snippet || '').trim().split('\n');
  const isAnonymous = row.customer === 'Anonymous user';

  return (
    <Dialog open={!!row} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Escalation Detail
      </DialogTitle>
      <DialogContent dividers>
        {/* Customer + meta */}
        <Box mb={2}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            CUSTOMER
          </Typography>
          <Typography fontWeight={600} fontSize={15}>
            {isAnonymous ? (
              <span style={{ color: '#999', fontStyle: 'italic' }}>Anonymous user</span>
            ) : (
              row.customer
            )}
          </Typography>
        </Box>
        <Box display="flex" gap={3} mb={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>TIME</Typography>
            <Typography fontSize={13}>{new Date(row.created_at).toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>STATUS</Typography>
            <Chip
              label={row.resolved ? 'Resolved' : 'Open'}
              size="small"
              color={row.resolved ? 'success' : 'warning'}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>SESSION</Typography>
            <Typography fontSize={12} sx={{ fontFamily: 'monospace' }}>
              {row.session_id.substring(0, 16)}…
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        {/* Trigger reason */}
        <Box mb={2}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            ESCALATION REASON
          </Typography>
          <Typography fontSize={14}>{row.reason}</Typography>
        </Box>

        {/* AI summary */}
        {row.summary && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box mb={2}>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                CONVERSATION SUMMARY
              </Typography>
              <Typography fontSize={14} sx={{ lineHeight: 1.6 }}>{row.summary}</Typography>
              {row.summary_topics.length > 0 && (
                <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
                  {row.summary_topics.map((t) => (
                    <Chip key={t} label={t} size="small" variant="outlined" />
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}

        {/* Conversation snippet */}
        {row.conversation_snippet && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                CONVERSATION AT ESCALATION
              </Typography>
              <Box
                sx={{
                  background: '#F5F5F5',
                  borderRadius: 1,
                  p: 1.5,
                  maxHeight: 220,
                  overflowY: 'auto',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                {snippetLines.map((line, i) => {
                  const isUser = line.startsWith('User:');
                  const isBot = line.startsWith('Bot:') || line.startsWith('Assistant:');
                  return (
                    <Box
                      key={i}
                      sx={{
                        color: isUser ? '#1565C0' : isBot ? '#2E7D32' : 'text.secondary',
                        fontWeight: isUser || isBot ? 500 : 400,
                        mb: 0.3,
                      }}
                    >
                      {line}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </>
        )}

        {!row.summary && !row.conversation_snippet && (
          <Typography color="text.secondary" fontSize={13} fontStyle="italic">
            No conversation detail available for this escalation.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function Analytics({ className }: { className?: string }) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [days, setDays] = useState<string>('30');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationRow | null>(null);

  // Load bot list on mount
  useEffect(() => {
    API.bots().then((res) => {
      const list: Bot[] = res.data;
      setBots(list);
      if (list.length > 0) setSelectedBot(String(list[0].id));
    }).catch(console.error);
  }, []);

  // Fetch analytics whenever bot or days changes
  useEffect(() => {
    if (!selectedBot) return;
    setLoading(true);
    API.analyticsSummary(selectedBot, days)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedBot, days]);

  const kpis = data?.kpis;

  const lineLabels = (data?.conversations_by_day || []).map((d) => d.date);
  const lineSeries = (data?.conversations_by_day || []).map((d) => d.count);

  const sentimentLabels = (data?.sentiment_trend || []).map((d) => d.date);
  const sentimentSeries = (data?.sentiment_trend || []).map((d) => d.avg_sentiment);

  return (
    <Grid className={className} sx={{ p: 0 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h1">Conversation Intelligence</Typography>
        <Box display="flex" gap={2}>
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

      {loading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}

      {!loading && data && (
        <>
          {/* KPI Cards */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <KpiCard
                icon={<ChatBubbleOutlineIcon sx={{ color: '#fff' }} />}
                label="Total Conversations" value={kpis!.total_conversations}
                color="rgba(33,150,243,0.8)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <KpiCard
                icon={<PeopleOutlineIcon sx={{ color: '#fff' }} />}
                label="Unique Customers" value={kpis!.unique_customers}
                color="rgba(76,175,80,0.8)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <KpiCard
                icon={<WarningAmberIcon sx={{ color: '#fff' }} />}
                label="Escalation Rate"
                value={`${(kpis!.escalation_rate * 100).toFixed(1)}%`}
                color="rgba(244,67,54,0.8)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <KpiCard
                icon={<CheckCircleOutlineIcon sx={{ color: '#fff' }} />}
                label="Resolution Rate"
                value={`${(kpis!.resolution_rate * 100).toFixed(1)}%`}
                color="rgba(0,150,136,0.8)"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2.4}>
              <KpiCard
                icon={<TrendingUpIcon sx={{ color: '#fff' }} />}
                label="Avg Sentiment"
                value={kpis!.avg_sentiment.toFixed(2)}
                color={kpis!.avg_sentiment >= 0 ? 'rgba(156,39,176,0.8)' : 'rgba(255,152,0,0.8)'}
              />
            </Grid>
          </Grid>

          {/* Charts row */}
          <Grid container spacing={3} mb={3}>
            {/* Conversations over time */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                <Typography variant="h6" mb={2}>Conversations Over Time</Typography>
                {lineLabels.length > 0 ? (
                  <LineChart
                    xAxis={[{ data: lineLabels, scaleType: 'band' }]}
                    series={[{ data: lineSeries, label: 'Conversations', color: '#7C4DFF' }]}
                    height={240}
                  />
                ) : (
                  <EmptyState title="No data yet" description="Conversation data will appear here once your bots are active." />
                )}
              </Paper>
            </Grid>

            {/* Top Topics — Treemap */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" mb={2}>Top Topics</Typography>
                <TopicsTreemap topics={data.top_topics} />
              </Paper>
            </Grid>
          </Grid>

          {/* Sentiment trend */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2.5, borderRadius: 2 }}>
                <Typography variant="h6" mb={2}>Sentiment Trend</Typography>
                {sentimentLabels.length > 0 ? (
                  <LineChart
                    xAxis={[{ data: sentimentLabels, scaleType: 'band' }]}
                    series={[{
                      data: sentimentSeries, label: 'Avg Sentiment', color: '#EF5350',
                      area: true,
                    }]}
                    height={200}
                    yAxis={[{ min: -1, max: 1 }]}
                  />
                ) : (
                  <Box py={4} textAlign="center">
                    <Typography color="text.secondary">No sentiment data yet</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Recent escalations */}
          <Paper sx={{ p: 2.5, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Recent Escalations</Typography>
              <Typography variant="caption" color="text.secondary">
                Click any row to view conversation detail
              </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 360 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Customer</StyledTableCell>
                    <StyledTableCell>Reason</StyledTableCell>
                    <StyledTableCell>Topics</StyledTableCell>
                    <StyledTableCell>Slack</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Time</StyledTableCell>
                    <StyledTableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.recent_escalations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ border: 0 }}>
                        <EmptyState title="No escalations" description="No escalations were recorded in this period." />
                      </TableCell>
                    </TableRow>
                  ) : data.recent_escalations.map((row, i) => {
                    const isEmail = row.customer.includes('@');
                    return (
                      <TableRow
                        key={i}
                        hover
                        onClick={() => setSelectedEscalation(row)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Typography fontSize={13} fontWeight={isEmail ? 600 : 400} color={isEmail ? 'text.primary' : 'text.secondary'}>
                            {row.customer}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>
                          <Typography noWrap title={row.reason} fontSize={13}>{row.reason}</Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 160 }}>
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {row.summary_topics.slice(0, 2).map((t) => (
                              <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                            ))}
                            {row.summary_topics.length > 2 && (
                              <Chip label={`+${row.summary_topics.length - 2}`} size="small" sx={{ fontSize: 10 }} />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.slack_notified ? 'Sent' : 'No'}
                            size="small"
                            color={row.slack_notified ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.resolved ? 'Resolved' : 'Open'}
                            size="small"
                            color={row.resolved ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                          {new Date(row.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <OpenInNewIcon sx={{ fontSize: 15, color: 'text.disabled' }} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {!loading && !data && selectedBot && (
        <Box py={8} textAlign="center">
          <Typography color="text.secondary">Select an agent to view analytics</Typography>
        </Box>
      )}

      {/* Escalation detail dialog */}
      <EscalationDialog
        row={selectedEscalation}
        onClose={() => setSelectedEscalation(null)}
      />
    </Grid>
  );
}

export default styled(Analytics)(() => ({
  padding: '16px 24px',
  '& .MuiPaper-root': { boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
}));
