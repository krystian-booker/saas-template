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
import Divider from '@mui/material/Divider';
import { GoogleLoginButton, MicrosoftLoginButton, AppleLoginButton, GithubLoginButton } from 'react-social-login-buttons';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const allProviders = [
        { key: 'Google', displayName: 'Google', enabled: import.meta.env.VITE_AUTH_GOOGLE_ENABLED === 'true', button: GoogleLoginButton },
        { key: 'Microsoft', displayName: 'Microsoft', enabled: import.meta.env.VITE_AUTH_MICROSOFT_ENABLED === 'true', button: MicrosoftLoginButton },
        { key: 'Apple', displayName: 'Apple', enabled: import.meta.env.VITE_AUTH_APPLE_ENABLED === 'true', button: AppleLoginButton },
        { key: 'GitHub', displayName: 'GitHub', enabled: import.meta.env.VITE_AUTH_GITHUB_ENABLED === 'true', button: GithubLoginButton },
    ];

    const enabledProviders = allProviders.filter(p => p.enabled);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setTimeout(() => {
                navigate('/home');
            }, 5000);
        }
    }, [navigate]);

    const validateForm = () => {
        const newErrors: string[] = [];
        if (!email) {
            newErrors.push("Email is required.");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.push("Please enter a valid email address.");
        }

        if (!password) {
            newErrors.push("Password is required.");
        } else {
            if (password.length < 8) {
                newErrors.push("Password must be at least 8 characters long.");
            }
            if (!/[a-z]/.test(password)) {
                newErrors.push("Password must contain at least one lowercase letter.");
            }
            if (!/[A-Z]/.test(password)) {
                newErrors.push("Password must contain at least one uppercase letter.");
            }
            if (!/\d/.test(password)) {
                newErrors.push("Password must contain at least one number.");
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                newErrors.push("Password must contain at least one special character.");
            }
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

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
                if (errorData && errorData.errors) {
                    const serverErrors = Object.values(errorData.errors).flat() as string[];
                    setErrors(serverErrors);
                } else if (errorData && errorData.title) {
                    setErrors([errorData.title]);
                } else {
                    setErrors(["An unknown error occurred during registration."]);
                }
                console.error('Registration failed:', errorData);
            }
        } catch (err) {
            setErrors(['A network error occurred. Please try again.']);
            console.error('Network error:', err);
        }
    };

    const handleExternalSignIn = (provider: string) => {
        window.location.href = `/api/accounts/externalsignin?provider=${provider}`;
    };

    const socialButtonProps = {
        style: {
            width: '100%',
            height: '40px',
            margin: '8px 0',
            fontSize: '0.875rem',
        },
        iconSize: '20px',
        size: 'small',
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
                                error={errors.some(e => e.toLowerCase().includes('email'))}
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
                                error={errors.some(e => e.toLowerCase().includes('password'))}
                            />
                            {errors.length > 0 && (
                                <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                                    {errors.length === 1 ? (
                                        errors[0]
                                    ) : (
                                        <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                                            {errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    )}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, textTransform: 'none' }}
                            >
                                Sign Up
                            </Button>

                            <Divider sx={{ my: 1 }}>or</Divider>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {enabledProviders.map(provider => {
                                    const SocialLoginButton = provider.button;
                                    return <SocialLoginButton key={provider.key} onClick={() => handleExternalSignIn(provider.key)} {...socialButtonProps}>
                                        <span>Sign up with {provider.displayName}</span>
                                    </SocialLoginButton>
                                })}
                            </Box>
                            <Box textAlign='center' sx={{ mt: 2 }}>
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

export default SignUpPage;