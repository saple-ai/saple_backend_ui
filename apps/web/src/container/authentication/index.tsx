import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import API from '../../utils/api';
import axios from 'axios';
// import Logo from '../../assets/img/ComplyKey-Logo.png';
import Logo from '../../assets/img/saple-logo.jpeg';
import { styled } from '@mui/material/styles';
import style from './style';

const defaultTheme = createTheme();

interface SignInProps {
  className?: string;
}

interface LoginResponse {
  data: {
    access: string;
    refresh: string;
    role: string;
  };
}

const BRAND = {
  background:
    'radial-gradient(900px 400px at 20% -10%, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 55%), linear-gradient(120deg, #f8fbff 0%, #eef2ff 45%, #ecfeff 100%)',
  accent: '#4f46e5',
  accentSoft: 'rgba(79, 70, 229, 0.12)',
  title: '#111827',
  text: '#64748b',
  fieldBorder: 'rgba(148, 163, 184, 0.35)',
  cardBg: 'rgba(255, 255, 255, 0.92)',
  cardBorder: 'rgba(148, 163, 184, 0.25)',
  cardShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
  label: '#475569',
  inputBg: '#ffffff',
  inputFocusRing: '0 0 0 3px rgba(79, 70, 229, 0.12)',
};

function SignIn(props: SignInProps) {
  const { className } = props;
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      const response: LoginResponse = await API.login(username, password);
      const data = response.data;

      sessionStorage.clear();
      sessionStorage.setItem('access_token', data.access);
      sessionStorage.setItem('refresh_token', data.refresh);
      sessionStorage.setItem('role', data.role);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
      window.location.href = '/dashboard';
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        className={className}
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: '100vh',
          maxWidth: '100% !important',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          px: { xs: 2, md: 4 },
          background: BRAND.background,
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 240,
            background: 'linear-gradient(to top, rgba(255,255,255,0.94), rgba(255,255,255,0.45), rgba(255,255,255,0))',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            left: '14%',
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.12)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          className="root"
          sx={{
            width: '100%',
            maxWidth: 1040,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 440px' },
            gap: { xs: 0, md: 4 },
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' }, pr: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 4 }}>
              {/* <Box component="img" src={Logo} sx={{ height: 48, borderRadius: 1.5, objectFit: 'contain' }} /> */}
                {/* <Typography variant="h6" sx={{ color: '#0f172a', fontWeight: 800 }}>
                  saple.ai
                </Typography> */}
            </Box>
            <Typography variant="h3" sx={{ color: '#0f172a', fontWeight: 800, mb: 2, lineHeight: 1.15, letterSpacing: '-0.8px' }}>
              Customer Support
              <br />
              <Box component="span" sx={{ color: BRAND.accent }}>Powered by AI</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: BRAND.text, maxWidth: 420, mb: 3.5, lineHeight: 1.7 }}>
              Build, deploy, and scale intelligent assistants across channels with enterprise-grade controls.
            </Typography>
            {/* <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['Fast onboarding', 'Secure by default', 'Realtime insights'].map((item) => (
                <Box
                  key={item}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    background: BRAND.accentSoft,
                    color: '#3730a3',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box> */}
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.25, sm: 4.5 },
              borderRadius: 4.5,
              background: BRAND.cardBg,
              border: `1px solid ${BRAND.cardBorder}`,
              boxShadow: BRAND.cardShadow,
              backdropFilter: 'blur(12px)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 76,
                background: 'linear-gradient(to top, rgba(255,255,255,0.68), rgba(255,255,255,0))',
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
              <Box component="img" src={Logo} sx={{ height: 58, borderRadius: 1.5, objectFit: 'contain' }} />
            </Box>
            <Typography variant="h5" sx={{ color: BRAND.title, fontWeight: 800, textAlign: 'center', mb: 0.75 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: BRAND.text, textAlign: 'center', mb: 3 }}>
              Sign in to continue
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="caption" className="fw-700" sx={{ pb: 1, display: 'block', color: BRAND.label, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                Username
              </Typography>
            <TextField
              margin="none"
              required
              fullWidth
              id="username"
              name="username"
              size="small"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
              sx={{
                mb: 2.75,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: BRAND.inputBg,
                  transition: 'all 0.2s ease',
                  '& fieldset': { borderColor: BRAND.fieldBorder },
                  '&:hover fieldset': { borderColor: BRAND.accent },
                  '&.Mui-focused': { boxShadow: BRAND.inputFocusRing },
                  '&.Mui-focused fieldset': { borderColor: BRAND.accent },
                },
              }}
            />
              <Typography variant="caption" className="fw-700" sx={{ pb: 1, display: 'block', color: BRAND.label, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                Password
              </Typography>
            <TextField
              margin="none"
              required
              fullWidth
              size="small"
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              sx={{
                mb: 3.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: BRAND.inputBg,
                  transition: 'all 0.2s ease',
                  '& fieldset': { borderColor: BRAND.fieldBorder },
                  '&:hover fieldset': { borderColor: BRAND.accent },
                  '&.Mui-focused': { boxShadow: BRAND.inputFocusRing },
                  '&.Mui-focused fieldset': { borderColor: BRAND.accent },
                },
              }}
            />
              {error && <Typography variant="body2" color="error" sx={{ mb: 1 }}>{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                height: 48,
                borderRadius: 2.25,
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                boxShadow: '0 10px 22px rgba(79, 70, 229, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)',
                  boxShadow: '0 12px 26px rgba(79, 70, 229, 0.34)',
                },
              }}
              className="saveBtn"
            >
              Login
            </Button>
              {/* <Typography variant="caption" display="block" align="center" sx={{ mt: 2, color: BRAND.text }}>
                Secure login for your workspace
              </Typography> */}
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default styled(SignIn)(style);