import { useEffect, useState } from 'react';
import {
    Box, Button, Card, CardContent, CardHeader, Chip, CircularProgress,
    Divider, Grid, LinearProgress, Snackbar, Alert, ToggleButton,
    ToggleButtonGroup, Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import API from '../../utils/api';

interface PlanLimits {
    max_bots: number;
    max_messages_per_month: number;
    max_api_keys: number;
    max_team_members: number;
    max_training_docs: number;
}

interface PlanFeatures {
    allow_whatsapp: boolean;
    allow_voice: boolean;
    allow_analytics: boolean;
    allow_custom_escalation: boolean;
    allow_api_access: boolean;
}

interface Plan {
    id: number;
    name: string;
    tier: string;
    price_monthly: string;
    price_yearly: string;
    limits: PlanLimits;
    features: PlanFeatures;
}

interface Subscription {
    id: number;
    status: string;
    billing_cycle: string;
    messages_used: number;
    plan: Plan;
}

const TIER_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'success'> = {
    free: 'default',
    starter: 'primary',
    pro: 'secondary',
    enterprise: 'success',
};

const FEATURE_LABELS: Record<keyof PlanFeatures, string> = {
    allow_whatsapp: 'WhatsApp Channel',
    allow_voice: 'Voice AI',
    allow_analytics: 'Advanced Analytics',
    allow_custom_escalation: 'Custom Escalation Rules',
    allow_api_access: 'REST API Access',
};

function UsageBar({ used, max, label }: { used: number; max: number; label: string }) {
    const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
    const color = pct > 90 ? 'error' : pct > 70 ? 'warning' : 'primary';
    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{label}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {used.toLocaleString()} / {max.toLocaleString()}
                </Typography>
            </Box>
            <LinearProgress variant="determinate" value={pct} color={color} sx={{ borderRadius: 1, height: 6 }} />
        </Box>
    );
}

export default function SubscriptionPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false, message: '', severity: 'success',
    });

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') =>
        setSnackbar({ open: true, message, severity });

    const fetchData = async () => {
        try {
            const [plansRes, subRes] = await Promise.all([
                API.listSubscriptionPlans(),
                API.mySubscription(),
            ]);
            setPlans(plansRes.data);
            setSubscription(subRes.data?.subscription !== null ? subRes.data : null);
            if (subRes.data?.billing_cycle) {
                setBillingCycle(subRes.data.billing_cycle);
            }
        } catch {
            showSnackbar('Failed to load subscription data', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSelectPlan = async (planId: number) => {
        setUpgrading(planId);
        try {
            await API.updateSubscription(planId, billingCycle);
            showSnackbar('Subscription updated successfully');
            fetchData();
        } catch (err: any) {
            showSnackbar(err?.response?.data?.error || 'Failed to update subscription', 'error');
        } finally {
            setUpgrading(null);
        }
    };

    const currentPlanId = subscription?.plan?.id;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>Subscription & Plans</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Choose a plan that fits your team. All plans include a 14-day free trial.
            </Typography>

            {/* Current usage */}
            {subscription && (
                <Card sx={{ mb: 4 }} elevation={0} variant="outlined">
                    <CardHeader
                        title="Current Usage"
                        subheader={`Plan: ${subscription.plan.name} · Status: ${subscription.status}`}
                        action={
                            <Chip
                                label={subscription.plan.tier.toUpperCase()}
                                color={TIER_COLORS[subscription.plan.tier]}
                                size="small"
                            />
                        }
                    />
                    <CardContent>
                        <UsageBar
                            used={subscription.messages_used}
                            max={subscription.plan.limits.max_messages_per_month}
                            label="Messages this month"
                        />
                    </CardContent>
                </Card>
            )}

            {/* Billing toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 2, alignItems: 'center' }}>
                <ToggleButtonGroup
                    value={billingCycle}
                    exclusive
                    onChange={(_, v) => v && setBillingCycle(v)}
                    size="small"
                >
                    <ToggleButton value="monthly">Monthly</ToggleButton>
                    <ToggleButton value="yearly">
                        Yearly
                        <Chip label="Save 20%" size="small" color="success" sx={{ ml: 1 }} />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Plan cards */}
            <Grid container spacing={3}>
                {plans.map(plan => {
                    const isCurrent = plan.id === currentPlanId;
                    const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
                    const isUpgrading = upgrading === plan.id;

                    return (
                        <Grid item xs={12} sm={6} md={3} key={plan.id}>
                            <Card
                                elevation={isCurrent ? 4 : 0}
                                variant={isCurrent ? 'elevation' : 'outlined'}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: isCurrent ? '2px solid' : undefined,
                                    borderColor: isCurrent ? 'primary.main' : undefined,
                                    position: 'relative',
                                }}
                            >
                                {isCurrent && (
                                    <Chip
                                        label="Current Plan"
                                        color="primary"
                                        size="small"
                                        sx={{ position: 'absolute', top: 12, right: 12 }}
                                    />
                                )}
                                <CardHeader
                                    title={plan.name}
                                    subheader={
                                        <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                                            ${parseFloat(price).toFixed(0)}
                                            <Typography component="span" variant="body2" color="text.secondary">
                                                /{billingCycle === 'yearly' ? 'yr' : 'mo'}
                                            </Typography>
                                        </Typography>
                                    }
                                />
                                <CardContent sx={{ flex: 1 }}>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        LIMITS
                                    </Typography>
                                    {[
                                        `${plan.limits.max_bots} bot${plan.limits.max_bots !== 1 ? 's' : ''}`,
                                        `${plan.limits.max_messages_per_month.toLocaleString()} messages/mo`,
                                        `${plan.limits.max_api_keys} API key${plan.limits.max_api_keys !== 1 ? 's' : ''}`,
                                        `${plan.limits.max_team_members} team member${plan.limits.max_team_members !== 1 ? 's' : ''}`,
                                    ].map(item => (
                                        <Typography key={item} variant="body2" sx={{ mb: 0.5 }}>• {item}</Typography>
                                    ))}

                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        FEATURES
                                    </Typography>
                                    {(Object.keys(FEATURE_LABELS) as Array<keyof PlanFeatures>).map(feat => (
                                        <Box key={feat} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                                            {plan.features[feat] ? (
                                                <CheckCircleIcon fontSize="small" color="success" />
                                            ) : (
                                                <RadioButtonUncheckedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                                            )}
                                            <Typography
                                                variant="body2"
                                                color={plan.features[feat] ? 'text.primary' : 'text.disabled'}
                                            >
                                                {FEATURE_LABELS[feat]}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant={isCurrent ? 'outlined' : 'contained'}
                                        disabled={isCurrent || isUpgrading}
                                        onClick={() => handleSelectPlan(plan.id)}
                                    >
                                        {isUpgrading ? <CircularProgress size={20} /> : isCurrent ? 'Current' : 'Select Plan'}
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
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
