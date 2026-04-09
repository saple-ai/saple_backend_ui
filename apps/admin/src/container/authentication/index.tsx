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
import Logo from '../../assets/svg/robologo.svg';
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
    'radial-gradient(780px 300px at 50% -5%, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 62%), linear-gradient(180deg, #f5fbf8 0%, #edf7f2 100%)',
  accent: '#059669',
  title: '#052e2b',
  text: '#4b5563',
  fieldBorder: 'rgba(148, 163, 184, 0.35)',
  cardBg: 'rgba(255, 255, 255, 0.94)',
  cardBorder: 'rgba(16, 185, 129, 0.22)',
  cardShadow: '0 24px 60px rgba(5, 150, 105, 0.14)',
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
          display: 'grid',
          placeItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          px: 2,
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
            height: 220,
            background: 'linear-gradient(to top, rgba(255,255,255,0.92), rgba(255,255,255,0.45), rgba(255,255,255,0))',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            right: '15%',
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.12)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          className="root"
          sx={{
            width: '100%',
            maxWidth: 430,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            zIndex: 1,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              background: BRAND.cardBg,
              border: `1px solid ${BRAND.cardBorder}`,
              boxShadow: BRAND.cardShadow,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
              <Box component="img" src={Logo} sx={{ height: 56, objectFit: 'contain' }} />
            </Box>
            <Typography variant="h5" sx={{ color: BRAND.title, fontWeight: 800, textAlign: 'center', mb: 3 }}>
              Admin Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="caption" className="fw-700" sx={{ pb: 1, display: 'block', color: BRAND.text, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
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
                  background: '#fff',
                  '& fieldset': { borderColor: BRAND.fieldBorder },
                  '&:hover fieldset': { borderColor: BRAND.accent },
                  '&.Mui-focused fieldset': { borderColor: BRAND.accent },
                },
              }}
            />
              <Typography variant="caption" className="fw-700" sx={{ pb: 1, display: 'block', color: BRAND.text, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
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
                  background: '#fff',
                  '& fieldset': { borderColor: BRAND.fieldBorder },
                  '&:hover fieldset': { borderColor: BRAND.accent },
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
                height: 46,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                boxShadow: '0 10px 22px rgba(5, 150, 105, 0.28)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                },
              }}
              className="saveBtn"
            >
              Login
            </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default styled(SignIn)(style);