import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setTimeout(() => {
                navigate('/home');
            }, 5000);
        }
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        try {
            const response = await fetch('/api/accounts/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                console.log('Registration successful');
                navigate('/login');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.errors ? Object.values(errorData.errors).flat().join(' ') : "Registration failed.";
                setError(errorMessage);
                console.error('Registration failed:', errorData);
            }
        } catch (err) {
            setError('A network error occurred. Please try again.');
            console.error('Network error:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {isLoggedIn ? (
                    <Box textAlign="center">
                        <Typography variant="h6">Welcome back!</Typography>
                        <Typography>
                            You are already logged in and will be redirected back to the home page shortly.
                        </Typography>
                        <Typography>
                            If you are not redirected automatically, follow <Link component={RouterLink} to="/home">this link</Link>.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Box textAlign='center'>
                                <Link component={RouterLink} to="/login" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
}

export default RegisterPage;