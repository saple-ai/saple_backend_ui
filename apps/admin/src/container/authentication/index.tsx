import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import API from '../../utils/api';
import axios from 'axios';
// import Logo from '../../assets/img/ComplyKey-Logo.png';
import Logo from '../../assets/img/saple-logo.jpeg'
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
      <Container className={className} component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          className="root"
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img className='logo' src={Logo} />
          {/* <Typography variant="h5" className='fw-700' sx={{ pb: 2, color: '#043927' }}>
            saple.ai
          </Typography> */}
          {/* <Typography variant="h5" className='fw-700' sx={{ pb: 2 }}>
            LOGIN
          </Typography> */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <Typography variant="body1" className='fw-700' sx={{ pb: 1 }}>Username</Typography>
            <TextField
              margin="none"
              required
              fullWidth
              id="username"
              name="username"
              size='small'
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
            />
            <Typography variant="body1" className='fw-700' sx={{ pb: 1, pt: 2 }}>Password</Typography>
            <TextField
              margin="none"
              required
              fullWidth
              size='small'
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
            {error && <Typography variant="body2" color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2 }}
              className='saveBtn'
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default styled(SignIn)(style);