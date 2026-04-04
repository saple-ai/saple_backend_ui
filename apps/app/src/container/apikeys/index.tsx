import { useEffect, useState } from 'react';
import {
    Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, MenuItem, Paper, Select, Snackbar, Alert, Switch,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, Tooltip, Typography, FormControl, InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import API from '../../utils/api';

interface ApiKey {
    id: number;
    name: string;
    prefix: string;
    bot_id: number | null;
    bot_name: string | null;
    enabled: boolean;
    last_used: string | null;
    created_at: string;
}

interface Bot {
    id: number;
    name: string;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [bots, setBots] = useState<Bot[]>([]);
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyBot, setNewKeyBot] = useState('');
    const [rawKey, setRawKey] = useState('');
    const [rawKeyOpen, setRawKeyOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success',
    });

    const fetchKeys = async () => {
        try {
            const res = await API.listApiKeys();
            setKeys(res.data);
        } catch {
            showSnackbar('Failed to load API keys', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchBots = async () => {
        try {
            const res = await API.bots();
            setBots(res.data);
        } catch {}
    };

    useEffect(() => {
        fetchKeys();
        fetchBots();
    }, []);

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCreate = async () => {
        if (!newKeyName.trim()) return;
        try {
            const res = await API.createApiKey(newKeyName.trim(), newKeyBot || undefined);
            setRawKey(res.data.key);
            setRawKeyOpen(true);
            setCreateOpen(false);
            setNewKeyName('');
            setNewKeyBot('');
            fetchKeys();
        } catch (err: any) {
            showSnackbar(err?.response?.data?.error || 'Failed to create API key', 'error');
        }
    };

    const handleToggle = async (key: ApiKey) => {
        try {
            await API.updateApiKey(key.id, { enabled: !key.enabled });
            setKeys(prev => prev.map(k => k.id === key.id ? { ...k, enabled: !k.enabled } : k));
        } catch {
            showSnackbar('Failed to update key', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Revoke this API key? This cannot be undone.')) return;
        try {
            await API.deleteApiKey(id);
            setKeys(prev => prev.filter(k => k.id !== id));
            showSnackbar('API key revoked');
        } catch {
            showSnackbar('Failed to delete key', 'error');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showSnackbar('Copied to clipboard');
    };

    const formatDate = (dt: string | null) => {
        if (!dt) return '—';
        return new Date(dt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h1" fontWeight={700}>API Keys</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                        Manage keys for the public REST API. Keys are shown only once at creation.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateOpen(true)}
                >
                    Create Key
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell><Typography fontWeight={600}>Name</Typography></TableCell>
                            <TableCell><Typography fontWeight={600}>Key Prefix</Typography></TableCell>
                            <TableCell><Typography fontWeight={600}>Bot Scope</Typography></TableCell>
                            <TableCell><Typography fontWeight={600}>Status</Typography></TableCell>
                            <TableCell><Typography fontWeight={600}>Last Used</Typography></TableCell>
                            <TableCell><Typography fontWeight={600}>Created</Typography></TableCell>
                            <TableCell align="right"><Typography fontWeight={600}>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : keys.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    No API keys yet. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            keys.map(key => (
                                <TableRow key={key.id} hover>
                                    <TableCell>{key.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${key.prefix}...`}
                                            size="small"
                                            sx={{ fontFamily: 'monospace', bgcolor: 'grey.100' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {key.bot_name ? (
                                            <Chip label={key.bot_name} size="small" color="primary" variant="outlined" />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">All bots</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            size="small"
                                            checked={key.enabled}
                                            onChange={() => handleToggle(key)}
                                            color="success"
                                        />
                                        <Typography variant="caption" color={key.enabled ? 'success.main' : 'text.disabled'}>
                                            {key.enabled ? 'Active' : 'Disabled'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{formatDate(key.last_used)}</TableCell>
                                    <TableCell>{formatDate(key.created_at)}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Revoke key">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(key.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Key Dialog */}
            <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Key Name"
                        placeholder="e.g. Production Widget"
                        value={newKeyName}
                        onChange={e => setNewKeyName(e.target.value)}
                        sx={{ mt: 1, mb: 2 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Bot Scope (optional)</InputLabel>
                        <Select
                            value={newKeyBot}
                            label="Bot Scope (optional)"
                            onChange={e => setNewKeyBot(e.target.value)}
                        >
                            <MenuItem value=""><em>All bots</em></MenuItem>
                            {bots.map(b => (
                                <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={!newKeyName.trim()}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Show Raw Key Dialog — shown once */}
            <Dialog open={rawKeyOpen} onClose={() => setRawKeyOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Your API Key</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Copy this key now — it will not be shown again.
                    </Alert>
                    <Box
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 1,
                            bgcolor: 'grey.100', borderRadius: 1, p: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }}
                        >
                            {rawKey}
                        </Typography>
                        <IconButton size="small" onClick={() => handleCopy(rawKey)}>
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => setRawKeyOpen(false)}>Done</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
