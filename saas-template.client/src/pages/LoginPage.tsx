import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Define providers and check if they are enabled via environment variables
    const allProviders = [
        { key: 'Google', displayName: 'Google', enabled: import.meta.env.VITE_AUTH_GOOGLE_ENABLED === 'true' },
        { key: 'Microsoft', displayName: 'Microsoft', enabled: import.meta.env.VITE_AUTH_MICROSOFT_ENABLED === 'true' },
        { key: 'Apple', displayName: 'Apple', enabled: import.meta.env.VITE_AUTH_APPLE_ENABLED === 'true' },
        { key: 'GitHub', displayName: 'GitHub', enabled: import.meta.env.VITE_AUTH_GITHUB_ENABLED === 'true' },
    ];

    const enabledProviders = allProviders.filter(p => p.enabled);

    useEffect(() => {
        const token = searchParams.get('token') || localStorage.getItem('token');
        if (token) {
            localStorage.setItem('token', token);
            setIsLoggedIn(true);
            setTimeout(() => {
                navigate('/home');
            }, 5000);
        }
    }, [navigate, searchParams]);

    const validateEmail = (email: string) => {
        // Regex for email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        // --- Client-side validation ---
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        // --- End of client-side validation ---

        try {
            const response = await fetch('/api/accounts/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                console.log('Login successful');
                navigate('/home');
            } else {
                // --- Handle server-side errors ---
                let errorMessage = 'Login failed. Please check your credentials.';
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData && errorData.errors) {
                        // Handle validation errors from ModelState
                        errorMessage = Object.values(errorData.errors).flat().join(' ');
                    }
                } catch (e) {
                    console.error('Error parsing error response:', e);
                }
                setError(errorMessage);
                console.error('Login failed');
            }
        } catch (err) {
            setError('A network error occurred. Please try again.');
            console.error('Network error:', err);
        }
    };

    const handleExternalLogin = (provider: string) => {
        window.location.href = `/api/accounts/externallogin?provider=${provider}`;
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
                            Sign In
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
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!error && (error.includes('email') || error.includes('credentials'))}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={!!error && (error.includes('password') || error.includes('credentials'))}
                            />
                            {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {enabledProviders.map(provider => (
                                    <Button
                                        key={provider.key}
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => handleExternalLogin(provider.key)}
                                    >
                                        Sign in with {provider.displayName}
                                    </Button>
                                ))}
                            </Box>
                            <Box textAlign='center' sx={{ mt: 2 }}>
                                <Link component={RouterLink} to="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Box>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
}

export default LoginPage;