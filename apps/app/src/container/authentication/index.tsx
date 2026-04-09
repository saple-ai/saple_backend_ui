import { useState } from 'react';
import {
  Box, Button, TextField, Typography, InputAdornment, IconButton,
  CircularProgress, Alert,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import Logo from '../../assets/img/saple-logo.jpeg';
import API from '../../utils/api';

const BRAND = {
  gradient: 'radial-gradient(900px 420px at 50% -5%, rgba(125, 211, 252, 0.32) 0%, rgba(125, 211, 252, 0) 60%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)',
  accent: '#4f46e5',
  panelBg: 'rgba(255,255,255,0.9)',
  border: 'rgba(148, 163, 184, 0.28)',
  textPrimary: '#111827',
  textSecondary: '#64748b',
  cardShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
  label: '#475569',
  heading: '#0f172a',
};

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
      const { role, username: uname } = response.data;
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('username', uname || username);
      window.location.href = '/dashboard';
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        background: BRAND.gradient,
        px: 2,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 260,
          background: 'linear-gradient(to top, rgba(255,255,255,0.92), rgba(255,255,255,0.45), rgba(255,255,255,0))',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 64,
          left: '12%',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'rgba(99, 102, 241, 0.12)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 90,
          right: '14%',
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'rgba(56, 189, 248, 0.14)',
          filter: 'blur(44px)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          background: BRAND.panelBg,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderRadius: 4,
          border: `1px solid ${BRAND.border}`,
          boxShadow: BRAND.cardShadow,
          p: { xs: 3, sm: 4.5 },
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 90,
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            background: 'linear-gradient(to top, rgba(255,255,255,0.78), rgba(255,255,255,0))',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box component="img" src={Logo} sx={{ height: 66, borderRadius: 1.5, objectFit: 'contain' }} />
        </Box>

        <Typography variant="h5" align="center" sx={{ color: BRAND.heading, fontWeight: 800, mb: 0.75, letterSpacing: '-0.4px' }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: BRAND.textSecondary, mb: 3.5 }}>
          Sign in to continue to your workspace
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="caption" fontWeight={700} sx={{ color: BRAND.label, mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
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
                  <PersonOutlineIcon sx={{ fontSize: 18, color: BRAND.textSecondary }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'rgba(255,255,255,0.9)',
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.35)' },
                '&:hover fieldset': { borderColor: BRAND.accent },
                '&.Mui-focused fieldset': { borderColor: BRAND.accent },
                '& input': { py: 1.2 },
              },
            }}
          />

          <Typography variant="caption" fontWeight={700} sx={{ color: BRAND.label, mb: 0.75, display: 'block', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
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
                  <LockOutlinedIcon sx={{ fontSize: 18, color: BRAND.textSecondary }} />
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
                background: 'rgba(255,255,255,0.9)',
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.35)' },
                '&:hover fieldset': { borderColor: BRAND.accent },
                '&.Mui-focused fieldset': { borderColor: BRAND.accent },
                '& input': { py: 1.2 },
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
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              boxShadow: '0 10px 22px rgba(79, 70, 229, 0.28)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)',
                boxShadow: '0 12px 24px rgba(79, 70, 229, 0.34)',
              },
              '&:disabled': { opacity: 0.65 },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
          </Button>
          <Typography variant="caption" align="center" display="block" sx={{ mt: 2.25, color: BRAND.textSecondary }}>
            Secure access powered by saple.ai
          </Typography>
        </Box>

        {/*
          Previous right-side content intentionally kept as comment per request.
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ...
          </Box>
        */}
      </Box>
    </Box>
  );
}
