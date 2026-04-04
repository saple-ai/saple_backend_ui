import { useState } from 'react';
import {
  Box, Button, TextField, Typography, InputAdornment, IconButton,
  CircularProgress, Alert, Divider,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Logo from '../../assets/img/saple-logo.jpeg';
import API from '../../utils/api';
import axios from 'axios';

const BRAND = {
  gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2d52 100%)',
  accent: '#6366f1',
  accentLight: '#818cf8',
};

const features = [
  { icon: '🤖', title: 'Agentic AI Agents', desc: 'Deploy intelligent agents trained on your docs' },
  { icon: '📊', title: 'Real-time Analytics', desc: 'Conversation insights, sentiment & escalation tracking' },
  { icon: '🔗', title: 'Multi-channel', desc: 'WhatsApp, REST API, voice — all in one platform' },
];

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await API.login(username, password);
      const { access, refresh, role } = response.data;
      sessionStorage.clear();
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('refresh_token', refresh);
      sessionStorage.setItem('role', role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      window.location.href = '/dashboard';
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      {/* ── Left brand panel ── */}
      <Box
        sx={{
          display: 'flex',
          flex: '0 0 45%',
          background: BRAND.gradient,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orbs */}
        {[
          { size: 320, top: -80, right: -80, opacity: 0.08 },
          { size: 200, bottom: 60, left: -60, opacity: 0.06 },
          { size: 120, top: '45%', right: 80, opacity: 0.1 },
        ].map((orb, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: BRAND.accent,
              opacity: orb.opacity,
              top: orb.top,
              bottom: orb.bottom,
              left: orb.left,
              right: orb.right,
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
          <Box
            component="img"
            src={Logo}
            sx={{ height: 36, borderRadius: 1.5, objectFit: 'contain' }}
          />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, letterSpacing: '-0.3px' }}>
            saple.ai
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.15, mb: 2, letterSpacing: '-1px' }}
        >
          Enterprise AI<br />
          <Box component="span" sx={{ color: BRAND.accentLight }}>Customer Support</Box>
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', mb: 6, maxWidth: 340, lineHeight: 1.7 }}>
          Deploy agentic AI that understands your business, learns from every conversation, and scales with your team.
        </Typography>

        {features.map((f) => (
          <Box key={f.title} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 2,
                background: 'rgba(99,102,241,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}
            >
              {f.icon}
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, mb: 0.25 }}>
                {f.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                {f.desc}
              </Typography>
            </Box>
          </Box>
        ))}

        <Box
          sx={{
            mt: 'auto', pt: 6, display: 'flex', alignItems: 'center', gap: 1,
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">Powered by advanced LLMs &amp; LangGraph</Typography>
        </Box>
      </Box>

      {/* ── Right form panel ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          px: { xs: 3, sm: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, mb: 5 }}>
            <Box component="img" src={Logo} sx={{ height: 32, borderRadius: 1 }} />
            <Typography variant="h6" fontWeight={700}>saple.ai</Typography>
          </Box>

          <Typography variant="h5" fontWeight={800} sx={{ mb: 0.75, letterSpacing: '-0.5px' }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Sign in to your workspace
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Username
            </Typography>
            <TextField
              fullWidth
              required
              size="small"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: '#fff',
                  '&:hover fieldset': { borderColor: BRAND.accent },
                  '&.Mui-focused fieldset': { borderColor: BRAND.accent },
                },
              }}
            />

            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Password
            </Typography>
            <TextField
              fullWidth
              required
              size="small"
              type={showPw ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPw(!showPw)} edge="end">
                      {showPw
                        ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                        : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: '#fff',
                  '&:hover fieldset': { borderColor: BRAND.accent },
                  '&.Mui-focused fieldset': { borderColor: BRAND.accent },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !username || !password}
              sx={{
                height: 46,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                background: `linear-gradient(135deg, ${BRAND.accent}, #7c3aed)`,
                boxShadow: `0 4px 20px ${BRAND.accent}44`,
                '&:hover': {
                  background: `linear-gradient(135deg, #4f46e5, #6d28d9)`,
                  boxShadow: `0 6px 24px ${BRAND.accent}66`,
                },
                '&:disabled': { opacity: 0.65 },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />
          <Typography variant="caption" color="text.disabled" align="center" display="block">
            © {new Date().getFullYear()} saple.ai · Enterprise AI Platform
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
