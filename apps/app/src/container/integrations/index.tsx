import React, { useState, useEffect } from 'react';
import EmptyState from '../../components/EmptyState';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
    CircularProgress,
    Snackbar,
    Alert,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Tooltip,
    Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import EmailIcon from '@mui/icons-material/Email';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import API from '../../utils/api';

interface IntegrationDef {
    id: string;
    name: string;
    description: string;
    icon: string;
    logoSlug?: string;
    brandColor?: string;
    available: boolean;
    configFields?: { key: string; label: string; type: string }[];
    isCustomApi?: boolean;
}

interface BackendIntegration {
    id: number;
    type: string;
    config: Record<string, string>;
    enabled: boolean;
}

interface ApiEndpoint {
    id: number;
    name: string;
    description: string;
    method: string;
    path: string;
    enabled: boolean;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const INTEGRATION_DEFS: IntegrationDef[] = [
    {
        id: 'slack',
        name: 'Slack',
        description: 'Manage your Slack conversations and deploy your agent to Slack channels.',
        icon: '💬',
        logoSlug: 'slack',
        brandColor: '#4A154B',
        available: true,
        configFields: [
            { key: 'webhook_url', label: 'Webhook URL', type: 'text' },
            { key: 'channel', label: 'Channel Name', type: 'text' },
        ],
    },
    {
        id: 'shopify',
        name: 'Shopify',
        description: 'Connect your Shopify store so your agent can answer product and order questions.',
        icon: '🛍️',
        logoSlug: 'shopify',
        brandColor: '#96BF48',
        available: true,
        configFields: [
            { key: 'store_url', label: 'Store URL', type: 'text' },
            { key: 'api_key', label: 'API Key', type: 'password' },
        ],
    },
    {
        id: 'calendly',
        name: 'Calendly',
        description: 'Let your agent schedule meetings by embedding your Calendly link.',
        icon: '📅',
        logoSlug: 'calendly',
        brandColor: '#0069FF',
        available: true,
        configFields: [
            { key: 'calendly_url', label: 'Calendly URL', type: 'text' },
        ],
    },
    {
        id: 'stripe',
        name: 'Stripe',
        description: 'Manage payments, billing, and automate financial operations via your agent.',
        icon: '💳',
        logoSlug: 'stripe',
        brandColor: '#635BFF',
        available: true,
        configFields: [
            { key: 'publishable_key', label: 'Publishable Key', type: 'text' },
            { key: 'secret_key', label: 'Secret Key', type: 'password' },
        ],
    },
    {
        id: 'hubspot',
        name: 'HubSpot',
        description: 'Sync contacts, track deals, and let your agent create CRM records directly from conversations.',
        icon: '🟠',
        logoSlug: 'hubspot',
        brandColor: '#FF7A59',
        available: true,
        configFields: [
            { key: 'api_key', label: 'Private App Token (starts with pat-)', type: 'password' },
        ],
    },
    {
        id: 'zendesk',
        name: 'Zendesk',
        description: 'Connect Zendesk so your agent can escalate tickets to humans, draft suggestions or auto-reply.',
        icon: '🎫',
        logoSlug: 'zendesk',
        brandColor: '#03363D',
        available: true,
        configFields: [
            { key: 'subdomain', label: 'Zendesk Subdomain', type: 'text' },
            { key: 'api_token', label: 'API Token', type: 'password' },
            { key: 'email', label: 'Admin Email', type: 'text' },
        ],
    },
    {
        id: 'custom_api',
        name: 'Custom API',
        description: "Connect your own REST APIs so the agent can query your internal systems — inventory, orders, users, and more.",
        icon: '🔌',
        brandColor: '#238DE9',
        available: true,
        isCustomApi: true,
    },
    {
        id: 'sunshine',
        name: 'Sunshine',
        description: 'Connect Sunshine to enable live chat handoff inside Zendesk.',
        icon: '☀️',
        brandColor: '#FFB400',
        available: false,
        configFields: [],
    },
    {
        id: 'whatsapp',
        name: 'WhatsApp',
        description: 'Deploy your agent on WhatsApp to reach customers on their preferred channel.',
        icon: '📱',
        logoSlug: 'whatsapp',
        brandColor: '#25D366',
        available: false,
        configFields: [],
    },
    {
        id: 'smtp',
        name: 'Email (SMTP)',
        description: 'Send escalation alerts to your support team by email when the agent hands off a conversation to a human.',
        icon: '✉️',
        brandColor: '#EA4335',
        available: true,
        configFields: [
            { key: 'host', label: 'SMTP Host', type: 'text' },
            { key: 'port', label: 'Port (e.g. 587)', type: 'text' },
            { key: 'username', label: 'Username / Login Email', type: 'text' },
            { key: 'password', label: 'Password', type: 'password' },
            { key: 'from_email', label: 'From Email', type: 'text' },
            { key: 'from_name', label: 'From Name (e.g. BRM Support)', type: 'text' },
            { key: 'to_emails', label: 'Notify Emails (comma-separated)', type: 'text' },
            { key: 'use_tls', label: 'Use STARTTLS? (true / false)', type: 'text' },
            { key: 'send_customer_confirmation', label: 'Send confirmation email to customer? (true / false)', type: 'text' },
        ],
    },
];

// ── Integration Icon ──────────────────────────────────────────────────────────

const IntegrationIcon: React.FC<{ def: IntegrationDef }> = ({ def }) => {
    const bg = def.brandColor || '#6B7280';

    if (def.logoSlug) {
        return (
            <Box sx={{
                width: 52, height: 52, borderRadius: 2,
                bgcolor: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <img
                    src={`https://cdn.simpleicons.org/${def.logoSlug}`}
                    width={28} height={28}
                    alt={def.name}
                    style={{ display: 'block', filter: 'brightness(0) invert(1)' }}
                />
            </Box>
        );
    }

    if (def.id === 'custom_api') {
        return (
            <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CodeIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
        );
    }

    if (def.id === 'smtp') {
        return (
            <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <EmailIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
        );
    }

    if (def.id === 'sunshine') {
        return (
            <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <WbSunnyIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
        );
    }

    return (
        <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 26 }}>
            {def.icon}
        </Box>
    );
};

// ── Custom API Dialog ─────────────────────────────────────────────────────────

interface EndpointFormState {
    id?: number;
    name: string;
    description: string;
    method: string;
    path: string;
}

const EMPTY_EP: EndpointFormState = { name: '', description: '', method: 'GET', path: '' };

interface CustomApiDialogProps {
    open: boolean;
    existing: BackendIntegration | null;
    onClose: () => void;
    onSaved: (integration: BackendIntegration) => void;
    onDisconnect: () => void;
    showSnack: (msg: string, sev: 'success' | 'error') => void;
}

const CustomApiDialog: React.FC<CustomApiDialogProps> = ({
    open, existing, onClose, onSaved, onDisconnect, showSnack,
}) => {
    const [step, setStep] = useState<'config' | 'endpoints'>('config');
    const [config, setConfig] = useState<Record<string, string>>({
        base_url: '', auth_type: 'none', token: '', api_key: '', api_key_header: 'X-API-Key',
    });
    const [saving, setSaving] = useState(false);
    const [savedIntegration, setSavedIntegration] = useState<BackendIntegration | null>(null);
    const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
    const [epForm, setEpForm] = useState<EndpointFormState>(EMPTY_EP);
    const [epDialogOpen, setEpDialogOpen] = useState(false);
    const [epSaving, setEpSaving] = useState(false);
    const [loadingEps, setLoadingEps] = useState(false);

    const activeIntegration = savedIntegration || existing;

    useEffect(() => {
        if (open) {
            if (existing) {
                setConfig({
                    base_url: existing.config.base_url || '',
                    auth_type: existing.config.auth_type || 'none',
                    token: existing.config.token || '',
                    api_key: existing.config.api_key || '',
                    api_key_header: existing.config.api_key_header || 'X-API-Key',
                });
                setStep('endpoints');
                loadEndpoints(existing.id);
            } else {
                setConfig({ base_url: '', auth_type: 'none', token: '', api_key: '', api_key_header: 'X-API-Key' });
                setStep('config');
                setEndpoints([]);
            }
            setSavedIntegration(null);
        }
    }, [open, existing]);

    const loadEndpoints = (integrationId: number) => {
        setLoadingEps(true);
        API.getEndpoints(integrationId)
            .then(res => setEndpoints(res.data))
            .catch(() => showSnack('Failed to load endpoints', 'error'))
            .finally(() => setLoadingEps(false));
    };

    const handleSaveConfig = async () => {
        if (!config.base_url.trim()) {
            showSnack('Base URL is required', 'error');
            return;
        }
        setSaving(true);
        try {
            let res;
            if (existing) {
                res = await API.updateIntegration(existing.id, { config, enabled: true });
            } else {
                res = await API.createIntegration('custom_api', config);
            }
            const integration = res.data as BackendIntegration;
            setSavedIntegration(integration);
            onSaved(integration);
            setStep('endpoints');
            loadEndpoints(integration.id);
            showSnack('Configuration saved', 'success');
        } catch {
            showSnack('Failed to save configuration', 'error');
        } finally {
            setSaving(false);
        }
    };

    const openAddEndpoint = () => {
        setEpForm(EMPTY_EP);
        setEpDialogOpen(true);
    };

    const openEditEndpoint = (ep: ApiEndpoint) => {
        setEpForm({ id: ep.id, name: ep.name, description: ep.description, method: ep.method, path: ep.path });
        setEpDialogOpen(true);
    };

    const handleSaveEndpoint = async () => {
        const integrationId = activeIntegration?.id;
        if (!integrationId) return;
        if (!epForm.name.trim() || !epForm.path.trim()) {
            showSnack('Name and Path are required', 'error');
            return;
        }
        setEpSaving(true);
        try {
            if (epForm.id) {
                const res = await API.updateEndpoint(integrationId, epForm.id, {
                    name: epForm.name, description: epForm.description, method: epForm.method, path: epForm.path,
                });
                setEndpoints(prev => prev.map(e => e.id === epForm.id ? res.data : e));
            } else {
                const res = await API.createEndpoint(integrationId, {
                    name: epForm.name, description: epForm.description, method: epForm.method, path: epForm.path,
                });
                setEndpoints(prev => [...prev, res.data]);
            }
            setEpDialogOpen(false);
            showSnack('Endpoint saved', 'success');
        } catch {
            showSnack('Failed to save endpoint', 'error');
        } finally {
            setEpSaving(false);
        }
    };

    const handleDeleteEndpoint = async (ep: ApiEndpoint) => {
        const integrationId = activeIntegration?.id;
        if (!integrationId) return;
        try {
            await API.deleteEndpoint(integrationId, ep.id);
            setEndpoints(prev => prev.filter(e => e.id !== ep.id));
            showSnack('Endpoint removed', 'success');
        } catch {
            showSnack('Failed to delete endpoint', 'error');
        }
    };

    const methodColor = (m: string) => {
        const colors: Record<string, 'success' | 'primary' | 'warning' | 'error' | 'default'> = {
            GET: 'success', POST: 'primary', PUT: 'warning', PATCH: 'warning', DELETE: 'error',
        };
        return colors[m] || 'default';
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {step === 'config' ? '🔌 Connect Custom API' : '🔌 Custom API — Endpoints'}
                </DialogTitle>
                <Divider />

                {step === 'config' && (
                    <>
                        <DialogContent sx={{ pt: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Provide the base URL of your REST API and authentication details.
                                You can register individual endpoints in the next step.
                            </Typography>
                            <TextField
                                label="Base URL"
                                placeholder="https://api.example.com/v1"
                                fullWidth size="small" sx={{ mb: 2 }}
                                value={config.base_url}
                                onChange={e => setConfig(p => ({ ...p, base_url: e.target.value }))}
                            />
                            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                <InputLabel>Authentication</InputLabel>
                                <Select
                                    label="Authentication"
                                    value={config.auth_type}
                                    onChange={e => setConfig(p => ({ ...p, auth_type: e.target.value }))}
                                >
                                    <MenuItem value="none">No Authentication</MenuItem>
                                    <MenuItem value="bearer">Bearer Token</MenuItem>
                                    <MenuItem value="api_key">API Key Header</MenuItem>
                                </Select>
                            </FormControl>
                            {config.auth_type === 'bearer' && (
                                <TextField
                                    label="Bearer Token"
                                    type="password" fullWidth size="small" sx={{ mb: 2 }}
                                    value={config.token}
                                    onChange={e => setConfig(p => ({ ...p, token: e.target.value }))}
                                />
                            )}
                            {config.auth_type === 'api_key' && (
                                <>
                                    <TextField
                                        label="Header Name"
                                        placeholder="X-API-Key"
                                        fullWidth size="small" sx={{ mb: 2 }}
                                        value={config.api_key_header}
                                        onChange={e => setConfig(p => ({ ...p, api_key_header: e.target.value }))}
                                    />
                                    <TextField
                                        label="API Key Value"
                                        type="password" fullWidth size="small" sx={{ mb: 2 }}
                                        value={config.api_key}
                                        onChange={e => setConfig(p => ({ ...p, api_key: e.target.value }))}
                                    />
                                </>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button onClick={onClose} disabled={saving}>Cancel</Button>
                            <Button variant="contained" onClick={handleSaveConfig} disabled={saving}>
                                {saving ? <CircularProgress size={18} /> : 'Save & Continue'}
                            </Button>
                        </DialogActions>
                    </>
                )}

                {step === 'endpoints' && (
                    <>
                        <DialogContent sx={{ pt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Base URL: <strong>{config.base_url || activeIntegration?.config?.base_url}</strong>
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <Button size="small" variant="text" onClick={() => setStep('config')}>
                                        Edit Config
                                    </Button>
                                    <Button
                                        size="small" variant="outlined" startIcon={<AddIcon />}
                                        onClick={openAddEndpoint}
                                    >
                                        Add Endpoint
                                    </Button>
                                </Stack>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            {loadingEps ? (
                                <Box sx={{ textAlign: 'center', py: 3 }}><CircularProgress size={24} /></Box>
                            ) : endpoints.length === 0 ? (
                                <EmptyState title="No endpoints yet" description='Click "Add Endpoint" to define your first API call.' />
                            ) : (
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Method</TableCell>
                                            <TableCell>Path</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {endpoints.map(ep => (
                                            <TableRow key={ep.id}>
                                                <TableCell>
                                                    <Typography variant="body2" fontFamily="monospace">{ep.name}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={ep.method} size="small" color={methodColor(ep.method)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" fontFamily="monospace" sx={{ color: 'text.secondary' }}>
                                                        {ep.path}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {ep.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Edit">
                                                        <IconButton size="small" onClick={() => openEditEndpoint(ep)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteEndpoint(ep)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </DialogContent>
                        <DialogActions sx={{ px: 3, pb: 2 }}>
                            <Button color="error" onClick={onDisconnect} sx={{ mr: 'auto' }}>
                                Disconnect
                            </Button>
                            <Button onClick={onClose}>Done</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Endpoint add/edit dialog */}
            <Dialog open={epDialogOpen} onClose={() => setEpDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{epForm.id ? 'Edit Endpoint' : 'Add Endpoint'}</DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        label="Tool Name"
                        placeholder="get_order_status"
                        helperText="snake_case identifier the AI uses to call this endpoint"
                        fullWidth size="small" sx={{ mb: 2 }}
                        value={epForm.name}
                        onChange={e => setEpForm(p => ({ ...p, name: e.target.value }))}
                    />
                    <TextField
                        label="Description"
                        placeholder="Returns order status by order ID"
                        helperText="Describe what this endpoint does so the AI knows when to use it"
                        fullWidth size="small" sx={{ mb: 2 }}
                        value={epForm.description}
                        onChange={e => setEpForm(p => ({ ...p, description: e.target.value }))}
                    />
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Method</InputLabel>
                            <Select
                                label="Method"
                                value={epForm.method}
                                onChange={e => setEpForm(p => ({ ...p, method: e.target.value }))}
                            >
                                {HTTP_METHODS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Path"
                            placeholder="/orders/{order_id}"
                            helperText="Use {param} for dynamic values"
                            fullWidth size="small"
                            value={epForm.path}
                            onChange={e => setEpForm(p => ({ ...p, path: e.target.value }))}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setEpDialogOpen(false)} disabled={epSaving}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveEndpoint} disabled={epSaving}>
                        {epSaving ? <CircularProgress size={18} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// ── Main Integrations Page ────────────────────────────────────────────────────

const Integrations: React.FC = () => {
    const [backendIntegrations, setBackendIntegrations] = useState<BackendIntegration[]>([]);
    const [selected, setSelected] = useState<IntegrationDef | null>(null);
    const [config, setConfig] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [customApiOpen, setCustomApiOpen] = useState(false);
    const [testingSmtp, setTestingSmtp] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success',
    });

    const showSnack = (message: string, severity: 'success' | 'error') =>
        setSnackbar({ open: true, message, severity });

    useEffect(() => {
        API.getIntegrations()
            .then(res => setBackendIntegrations(res.data))
            .catch(() => {});
    }, []);

    const getBackend = (id: string) =>
        backendIntegrations.find(i => i.type === id && i.enabled);

    const handleOpen = (def: IntegrationDef) => {
        if (!def.available) return;
        if (def.isCustomApi) {
            setCustomApiOpen(true);
            return;
        }
        const existing = getBackend(def.id);
        setSelected(def);
        setConfig(existing?.config || {});
    };

    const handleClose = () => {
        setSelected(null);
        setConfig({});
    };

    const handleConnect = async () => {
        if (!selected) return;
        setLoading(true);
        try {
            const existing = backendIntegrations.find(i => i.type === selected.id);
            if (existing) {
                const res = await API.updateIntegration(existing.id, { config, enabled: true });
                setBackendIntegrations(prev => prev.map(i => i.id === existing.id ? res.data : i));
            } else {
                const res = await API.createIntegration(selected.id, config);
                setBackendIntegrations(prev => [...prev, res.data]);
            }
            showSnack(`${selected.name} connected successfully`, 'success');
            handleClose();
        } catch {
            showSnack('Failed to connect. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async (def: IntegrationDef) => {
        const existing = backendIntegrations.find(i => i.type === def.id);
        if (!existing) return;
        setLoading(true);
        try {
            await API.deleteIntegration(existing.id);
            setBackendIntegrations(prev => prev.filter(i => i.id !== existing.id));
            showSnack(`${def.name} disconnected`, 'success');
        } catch {
            showSnack('Failed to disconnect.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCustomApiSaved = (integration: BackendIntegration) => {
        setBackendIntegrations(prev => {
            const idx = prev.findIndex(i => i.id === integration.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = integration;
                return next;
            }
            return [...prev, integration];
        });
    };

    const handleCustomApiDisconnect = async () => {
        const existing = getBackend('custom_api');
        if (!existing) return;
        try {
            await API.deleteIntegration(existing.id);
            setBackendIntegrations(prev => prev.filter(i => i.id !== existing.id));
            showSnack('Custom API disconnected', 'success');
            setCustomApiOpen(false);
        } catch {
            showSnack('Failed to disconnect.', 'error');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h1" fontWeight={700} gutterBottom sx={{ color: '#0f172a' }}>
                Integrations
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontSize: '1rem' }}>
                Connect your Agent to external services to use integration-specific actions.
            </Typography>

            <Grid container spacing={3}>
                {INTEGRATION_DEFS.map((def) => {
                    const connected = !!getBackend(def.id);
                    return (
                        <Grid item xs={12} sm={6} md={4} key={def.id} sx={{ display: 'flex' }}>
                            <Card
                                sx={{
                                    width: '100%',
                                    minHeight: 220,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    opacity: def.available ? 1 : 0.55,
                                    borderRadius: '16px',
                                    border: connected ? '1px solid #bbf7d0' : '1px solid rgba(0,0,0,0.04)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
                                    transition: 'box-shadow 0.2s',
                                    '&:hover': def.available ? {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.10), 0 8px 32px rgba(0,0,0,0.06)',
                                    } : {},
                                    bgcolor: '#fff',
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: '20px !important', gap: 0 }}>
                                    {/* Header row: icon + status badge */}
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                        <IntegrationIcon def={def} />
                                        {!def.available && (
                                            <Chip label="Coming Soon" size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 500, fontSize: '0.6875rem' }} />
                                        )}
                                        {connected && (
                                            <Chip
                                                icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                                                label="Connected"
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                                sx={{ fontWeight: 500, fontSize: '0.6875rem' }}
                                            />
                                        )}
                                    </Box>

                                    {/* Name */}
                                    <Typography sx={{ mb: 0.5, color: '#0f172a', fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.3 }}>
                                        {def.name}
                                    </Typography>

                                    {/* Description */}
                                    <Typography sx={{ flexGrow: 1, mb: 2.5, lineHeight: 1.6, fontSize: '0.8125rem', color: '#64748b' }}>
                                        {def.description}
                                    </Typography>

                                    {/* Action button */}
                                    <Button
                                        variant={connected ? 'outlined' : 'contained'}
                                        fullWidth
                                        size="small"
                                        disabled={!def.available || loading}
                                        onClick={() => handleOpen(def)}
                                        sx={{
                                            mt: 'auto',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            fontSize: '0.8125rem',
                                            py: 0.9,
                                            boxShadow: 'none',
                                            ...(connected ? {
                                                borderColor: 'rgba(0,0,0,0.12)',
                                                color: '#475569',
                                                '&:hover': { borderColor: 'rgba(0,0,0,0.24)', bgcolor: '#f8fafc', boxShadow: 'none' },
                                            } : {
                                                bgcolor: '#334155',
                                                color: '#fff',
                                                '&:hover': { bgcolor: '#1e293b', boxShadow: 'none' },
                                            }),
                                        }}
                                    >
                                        {!def.available ? 'Coming Soon' : connected ? 'Manage' : 'Connect'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Standard config Dialog */}
            <Dialog open={!!selected} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {selected && getBackend(selected.id) ? `Manage ${selected.name}` : `Connect ${selected?.name}`}
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ pt: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {selected?.description}
                    </Typography>
                    {selected?.configFields?.map((field) => (
                        <TextField
                            key={field.key}
                            label={field.label}
                            type={field.type}
                            fullWidth size="small" sx={{ mb: 2 }}
                            value={config[field.key] || ''}
                            onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                        />
                    ))}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    {selected && getBackend(selected.id) && (
                        <Button
                            color="error"
                            disabled={loading}
                            onClick={() => { handleClose(); handleDisconnect(selected!); }}
                            sx={{ mr: 'auto' }}
                        >
                            Disconnect
                        </Button>
                    )}
                    {selected?.id === 'smtp' && (
                        <Button
                            variant="outlined"
                            disabled={loading || testingSmtp}
                            onClick={async () => {
                                setTestingSmtp(true);
                                try {
                                    await API.smtpTest(config);
                                    showSnack('Test email sent successfully!', 'success');
                                } catch (err: any) {
                                    const msg = err?.response?.data?.error || 'Test failed — check your SMTP settings';
                                    showSnack(msg, 'error');
                                } finally {
                                    setTestingSmtp(false);
                                }
                            }}
                        >
                            {testingSmtp ? <CircularProgress size={18} /> : 'Send Test Email'}
                        </Button>
                    )}
                    <Button onClick={handleClose} disabled={loading}>Cancel</Button>
                    <Button variant="contained" onClick={handleConnect} disabled={loading}>
                        {loading ? <CircularProgress size={18} /> : selected && getBackend(selected.id) ? 'Save' : 'Connect'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Custom API Dialog */}
            <CustomApiDialog
                open={customApiOpen}
                existing={getBackend('custom_api') || null}
                onClose={() => setCustomApiOpen(false)}
                onSaved={handleCustomApiSaved}
                onDisconnect={handleCustomApiDisconnect}
                showSnack={showSnack}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Integrations;
